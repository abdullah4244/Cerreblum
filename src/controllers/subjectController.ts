import { Request,Response } from "express"
import { Subject } from "../models/Subject";
export const createSubject = async (req : Request,res : Response) => {
    try {
       const {categoryId , title} = req.body;
       const subject = await Subject.create({
        category : categoryId,
        title : title
       })
       await subject.populate('category')
       res.status(200).json({subject})
    }
    catch(err) {
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}

export const getSubjects = async (req:Request,res :Response) => {
    try {
         const subjects = await Subject.find({}).populate('category');
         res.status(200).json({
            subjects
         })
    }
    catch(err) {
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}

export const getSubjectById = async (req :Request ,res :Response) => {
    try {
     const {id} =req.params;
     const subject = await Subject.findOne({_id:id})
     if(!subject) {
        res.status(404).json({message : "Subject with this id does not exists"});
     }
     res.status(200).json({subject})
    }
    catch(err) {
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}
export const deleteSubjectById = async (req :Request ,res :Response) => {
    try {
     const {id} =req.params;
     const subject = await Subject.findOne({_id:id})
     if(!subject) {
        return res.status(404).json({message : "Subject with this id does not exists"});
     }
     await subject.deleteOne()
     res.status(200).json({message : "Subject Successfully deleted"});
    }
    catch(err) {
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}