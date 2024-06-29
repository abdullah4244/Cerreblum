import { Request ,Response,NextFunction} from "express";
import {  User } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (req  : Request,res :Response ,next:NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded as JwtPayload;
      console.log(decoded, "decoded")
      next();
    });
}
export const login = async (req : Request,res :Response) => {
    try {
     const isExistingUser = await User.findOne({email : req.body.email});
     if(!isExistingUser) {
        return res.status(404).json({error : "Incorrect Email or Password"})
     }
     const passwordMatch = await bcrypt.compare(req.body.password, isExistingUser?.password as string);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: isExistingUser.email }, 'secret');
    const userObj = isExistingUser.toObject();
    delete userObj.password
    res.status(200).json({
       user : userObj,
       token : token
    })
    }catch(err) {
        return res.status(404).json({
            error: "Something went wrong"
         })
    }
}
export const getMe = async (req:Request,res : Response) => {
  try {
    const {email} = req.user as {email: string};
    const user = await User.findOne({email: email});
    const userObj = user?.toJSON();
    delete userObj?.password;
    res.status(200).json({user : userObj})
  }
  catch(err) {
    return res.status(404).json({
      error: "Something went wrong"
   })
  }
}
export const signup = async (req : Request,res : Response) => {
try {
    const {email} = req.body;
    const isExistingUser = await User.findOne({email: email});
    if(isExistingUser) {
        return res.status(400).json({error : "User with this email already exists."})
    }
   const user = new User({
    ...req.body,
   })
   await user.save()
   const userObj = user.toObject();
   delete userObj.password;
   const token = jwt.sign({ email: user.email }, 'secret');
   return res.status(200).json({
    user: userObj,
    token :token
   })
}
catch(err) {
    return res.status(404).json({
        error: "Something went wrong"
     })
}
}