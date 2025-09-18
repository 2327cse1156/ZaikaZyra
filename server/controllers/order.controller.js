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

    await newOrder.populate("shopOrders.shopOrderItems.item","name image price");
    await newOrder.populate("shopOrders.shop","name");

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
