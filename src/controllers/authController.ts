import { Request ,Response,NextFunction} from "express";
import {  IUSER, User } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { stripe } from "../utils/stripe";
import secrets from "../utils/config";

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
    isExistingUser.loginTimestamps.push(new Date())
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
export const getActiveUsers = async (req:Request ,res : Response) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
  const users = await User.find({
      loginTimestamps: {
          $gte: startOfMonth,
          $lt: endOfMonth
      }
  });

  const activeUsersCount = users.filter((user : IUSER) => {
      const loginsThisMonth = user.loginTimestamps.filter((timestamp : Date) => timestamp >= startOfMonth && timestamp < endOfMonth);
      return loginsThisMonth.length > 2;
  }).length;

  return res.status(200).json({activeUsers : activeUsersCount})
}
export const signup = async (req : Request,res : Response) => {
try {
    const {email} = req.body;
    const isExistingUser = await User.findOne({email: email});
    if(isExistingUser) {
        return res.status(400).json({error : "User with this email already exists."})
    }
    const customer = await stripe.customers.create({
      email : email,
      name : req.body.name
    })
   const user = new User({
    ...req.body,
    stripeId: customer.id
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
  console.log(err,"error")
    return res.status(404).json({
        error: "Something went wrong"
     })
}
}

export const getPlans = async (req:Request,res :Response)=> {
  try{
  const { data: prices } = await stripe.prices.list()
  const productPromises = prices.map(async price => {
    const product = await stripe.products.retrieve(price.product as string)
    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount,
      interval: price.recurring?.interval,
      currency: price.currency,
    }
  })
  const plans = await Promise.all(productPromises);
  return res.status(200).json({
    plans
  })
}
catch(err){
  console.log(err)
  return res.status(500).json({
    error: "Something went wrong"
 })
}


}

export const createSubscription = async (req : Request, res:Response) => {
  const { priceId } = req.params;
  const { email } = req.user as {email: string};

  try {
    const user = await User.findOne({email :email})

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId as string,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${secrets.CLIENT_URL}/app`,
      cancel_url: `${secrets.CLIENT_URL}/app`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}