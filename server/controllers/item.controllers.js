import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req,res)=>{
    try {
        const { name, foodType, price, category } = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({owner:req.userId})
    
        if(!shop){
            return res.status(404).json({message:"Shop not found"}) 
        }
        const item = await Item.create({
            name,
            foodType,
            price,
            category,
            image,
            shop:shop._id,
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error adding item", error });
    }
}

export const editItem = async (req,res) => {
    try {
        const itemId = req.params.itemId;
        const { name, foodType, price, category } = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            name,
            foodType,
            price,
            category,
            image,
        }, { new: true });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error editing item", error });
    }
}