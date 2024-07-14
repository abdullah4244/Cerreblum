import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import categoryRouter from './routes/categoryRouter';
import subjectRouter from './routes/subjectRouter';
import { stripe } from './utils/stripe';
import secrets from './utils/config';
import { User } from './models/User';
import { buffer } from 'micro'

const app = express();
app.use(express.json())
app.use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
    })
  );
  app.use("/upload", express.static("./storage"));
  app.post("/webhook", express.raw({ type: 'application/json' }),async (req, res) => {
   try {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = secrets.WEBHOOK_SECRET;
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      const reqBuffer = await buffer(req)
      const signature = req.headers['stripe-signature']
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          reqBuffer,
          signature as string,
          webhookSecret
        );
      } catch (err) {
        console.log(err,"error here")
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
    const { metadata } = data.object
    const stripeId = data.object.customer
    console.log(data.object,"upp")
    console.log(stripeId,"Came here");
    switch (eventType) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        break;
      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case 'customer.subscription.created':
          if (stripeId) {
            console.log("Subscription Created")
            await User.findOneAndUpdate({stripeId :stripeId},{isSubscribed : true})
          }
          break;
      case 'customer.subscription.updated':
            if (stripeId) {
              console.log("Subscription Created")
              await User.findOneAndUpdate({stripeId :stripeId},{isSubscribed : true})
            }
        break;
        case 'customer.subscription.deleted':
          if (stripeId) {
            console.log("Subscription Deleted")
            await User.findOneAndUpdate({stripeId :stripeId},{isSubscribed : false})
          }
          break;     
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
      default:
        // Unhandled event type
    }
  
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err,"error here")
    res.sendStatus(400);
  }
  });
app.use("/api/v1/user", userRouter);
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/subject',subjectRouter)
export default app;