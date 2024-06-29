import { Request ,Response,NextFunction} from "express";
import { Category } from "../models/Category";

export const createCategory = async (req :Request,res:Response) => {
    try {
         const {title} = req.body;
         const category = await Category.create({
            title : title
         })
         return res.status(200).json({
            category : category
         })
    }
    catch(err) {
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const getCategories = async (req :Request ,res :Response) => {
    try {
        const categories = await Category.find({})
        res.status(200).json({
            categories : categories
        })
    }
     catch(err) {
        res.status(500).json({message : "Internal Server Error"});
     }
}
export const deleteCategoryById = async (req : Request,res : Response) => {
   try {
     const {id} = req.params
     console.log("Entered here")
     const category = await Category.findOne({_id: id});
     if(!category) {
        return res.status(404).json({
            message : "Category with this id does not exists"
        })
     }
     await category.deleteOne()
     res.status(200).json({
        message :"Category Successfully deleted"
     })
   }
   catch(err) {
    console.log(err)
    res.status(500).json({message : "Internal Server Error"});
   }
}