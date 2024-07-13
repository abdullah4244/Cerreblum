import { Request,Response } from "express"
import { Subject } from "../models/Subject";
import { Topic } from "../models/Topics";
import { Page } from "../models/Pages";
export const createSubject = async (req : Request,res : Response) => {
    try {
       const {categoryId , title} = req.body;
       const photo = req.file?.filename;
       const subject = await Subject.create({
        category : categoryId,
        title : title,
        imageUrl : `/upload/${photo}`
       })
       await subject.populate('category')
       res.status(200).json({subject})
    }
    catch(err) {
        console.log(err, "error here")
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}

export const getSubjects = async (req:Request,res :Response) => {
    try {
        const constructQueryObj : Record<string,string> = {};
         const {category} = req.query;
         if(category) {
            constructQueryObj['category'] = category as string;
         }
         console.log(constructQueryObj)
         const subjects = await Subject.find({...constructQueryObj}).populate('category');
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

export const createTopics = async (req : Request,res: Response) => {
    try {
         const {id} = req.params;
         const {title} = req.body;
         const photo = req.file?.filename;
         const subject = await Subject.findOne({_id : id})
         if(!subject) {
            return res.status(404).json({message : "Subject with this id does not exists"});
         }
         const topic = await Topic.create({
            title,
            subject : subject._id,
            imageUrl : `/upload/${photo}`
         })
         subject?.topics.push(topic._id)
         await subject?.save()
         return res.status(200).json({message : "Topic created"});
    }
    catch(err) {
            return res.status(500).json({message : "Something went wrong!"});
    }
}

 export const getTopicsBySubject = async (req : Request ,res :Response) => {
    try {
        const {id} = req.params;
        const topics  = await Topic.find({subject : id})
        return res.status(200).json({topic : topics});
   }
   catch(err) {
           return res.status(500).json({message : "Something went wrong!"});
   }
 }
 export const getTopicById = async (req : Request,res : Response)=> {
    try {
        const {topicId} = req.params;
        const topic  = await Topic.findOne({_id : topicId}).populate('pages');
        return res.status(200).json({topic : topic});
   }
   catch(err) {
           return res.status(500).json({message : "Something went wrong!"});
   }
 }
 export const createPage = async (req :Request,res : Response) => {
try {
 const {topicId} = req.params;

 const topic = await Topic.findOne({_id : topicId})
 if(!topic) {
    return res.status(404).json({message : "Topic with this id does not exists"});
 }
  const page = await Page.create({
    ...req.body
  }) 
  topic?.pages.push(page.id);
  await topic?.save()
  return res.status(200).json({message : "Page Created"});
}


catch(err ){
    console.log(err)
    return res.status(500).json({message : "Something went wrong!"});
}
 }

 export const getPages = async (req :Request,res : Response) => {
    try {
     const {topicId} = req.params;
     const topic = await Topic.findOne({_id : topicId}).populate('pages')
     if(!topic) {
        return res.status(404).json({message : "Topic with this id does not exists"});
     }
      return res.status(200).json({pages : topic.pages});
    }
    
    
    catch(err ){
        return res.status(500).json({message : "Something went wrong!"});
    }
     }
 export const updatePage = async (req :Request, res :Response) => {
    try {
        const {pageId} = req.params;
        const page = await Page.findOneAndUpdate({_id : pageId},{...req.body},{new : true})
        if(!page) {
           return res.status(404).json({message : "Page with this id does not exists"});
        }
         return res.status(200).json({message : "Page Created"});
       }
       
       catch(err ){
           return res.status(500).json({message : "Something went wrong!"});
       }
 }

 export const getPageById = async (req :Request, res :Response) => {
    try {
        const {pageId} = req.params;
        const page = await Page.findOne({_id : pageId})
        if(!page) {
           return res.status(404).json({message : "Page with this id does not exists"});
        }
         return res.status(200).json({page :page});
       }
       
       catch(err ){
           return res.status(500).json({message : "Something went wrong!"});
       }
 }