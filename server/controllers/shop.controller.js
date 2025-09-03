import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;

    if (req.file) {
      console.log("📸 File received:", req.file.path);
      image = await uploadOnCloudinary(req.file.path);
    } else {
      console.log("⚠️ No file uploaded");
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (shop) {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, city, state, address, ...(image && { image }) },
        { new: true }
      );
    } else {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    }

    await shop.populate(["owner", "items"]);
    res.status(201).json(shop);
  } catch (error) {
    console.error("❌ Error creating/editing shop:", error);
    res.status(500).json({ message: "Error creating/editing shop", error });
  }
};

export const getMyShop = async (req, res) => {
  try {
    console.log("🔑 User ID:", req.userId);

    const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }
    });

    if (!shop) {
      console.log("⚠️ No shop found for user:", req.userId);
      return res.status(404).json(null);
    }

    return res.status(200).json(shop);
  } catch (error) {
    console.error("❌ Error fetching shop:", error);
    return res.status(500).json({ message: "Error fetching shop", error });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("items");

    if (shops.length === 0) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    return res.status(200).json(shops);
  } catch (error) {
    console.error("❌ Error fetching shops by city:", error);
    return res.status(500).json({ message: "Error fetching shops by city", error });
  }
};

