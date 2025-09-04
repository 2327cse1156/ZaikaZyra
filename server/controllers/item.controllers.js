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
        shop.items.push(item._id);
        await shop.save();
        await shop.populate("owner");
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
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
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        });

        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: "Error editing item", error });
    }
}

export const getItemById = async(req,res)=>{
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteItem = async(req,res)=>{
    try {
        const itemId = req.params.itemId;
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const shop = await Shop.findOne({ owner: req.userId });
        shop.items = shop.items.filter(item => item !== itemId);
        await shop.save();
        await shop.populate({path:"items", options:{sort:{updatedAt:-1}}})
        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: "Error deleting item", error });
    }
}

export const getItemByCity = async (req,res) => {
    try {
        const {city} = req.params;
        if(!city){
            return res.status(400).json({message:"City is required"});
        }
        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}$`,"i")}
        }).populate("items")

        if(!shops.length)
        {
            return res.status(404).json({message:"Shops not found"});
        }
        const shopIds = shops.map((shop)=>shop._id)

        const items = await Item.find({shop:{$in:shopIds}})

        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({ message: "get item by city error", error });
    }
}