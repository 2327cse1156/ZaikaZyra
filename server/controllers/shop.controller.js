import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });
    if (shop) {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, city, state, address, image },
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
      },{new:true});
    }
    await shop.populate("owner");
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error creating shop", error });
  }
};

export const getMyShop = async (req,res) => {
    try {
      console.log(req.userId);
        const shop = await Shop.findOne({owner:req.userId}).populate("owner");
        if(!shop){
          console.log("No shop found for user:", req.userId);
          return res.status(404).json(null);
        }
        return res.status(200).json(shop);
    } catch (error) {
      console.error("Error fetching shop:", error);
        return res.status(500).json({message:"Error fetching shop",error});
    }
}