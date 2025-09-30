import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Send Complete delivery Address" });
    }

    // 1️⃣ Group items by shop
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    // 2️⃣ Build shopOrders + subtotal
    let cartSubtotal = 0;
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) throw new Error("Shop not found");

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        cartSubtotal += subtotal;

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    // 3️⃣ Apply delivery fee and discount
    const deliveryFee = 40;
    const discount = cartSubtotal >= 500 ? 50 : 0;
    const finalTotal = cartSubtotal + deliveryFee - discount;

    // 4️⃣ Create new order
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      cartSubtotal,
      deliveryFee,
      discount,
      totalAmount: finalTotal,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json(newOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Place order error: ${error.message}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    }

    if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      const filteredOrders = orders.map((order) => {
        const shopOrder = order.shopOrders.find(
          (o) => o.owner.toString() === req.userId
        );

        return {
          _id: order._id,
          user: order.user,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress,

          // 📌 only the current owner's part
          shopOrders: shopOrder,

          // 📌 totals
          cartSubtotal: order.cartSubtotal,
          deliveryFee: order.deliveryFee,
          discount: order.discount,
          totalAmount: order.totalAmount,
        };
      });
      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get user order error: ${error.message}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    let deliveryBoyPayload = [];
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId
    );
    if (!shopOrder)
      return res.status(404).json({ message: "Shop order not found" });

    shopOrder.status = status;

    if (status == "out for delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearbyDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 7000,
          },
        },
      });
      const nearbyIds = nearbyDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearbyIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearbyDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );
      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message:
            "Order status updated but there is no available delivery boys",
          availableBoys: [],
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });
      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoyPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }
    await shopOrder.save();
    await order.save();
    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    );

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoyPayload,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    console.error(error); // for debugging
    return res.status(500).json({
      message: "Order status error",
    });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formated = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItems || [],
      subtotal:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          ?.subtotal || 0,
    }));

    return res.status(200).json(formated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching assignments" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    if (assignment.status !== "broadcasted") {
      return res.status(400).json({ message: "Assignment not available" });
    }
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return res.status(400).json({
        message:
          "You have a pending assignment. Complete or cancel it before accepting a new one.",
      });
    }
    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const shopOrder = order.shopOrders.find((so) =>
      so._id.equals(assignment.shopOrderId)
    );

    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();
    // await order.populate("shopOrders.assignedDeliveryBoy")

    return res.status(200).json({ message: "Assignment accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error accepting assignments" });
  }
};
