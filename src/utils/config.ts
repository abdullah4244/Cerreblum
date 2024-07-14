import dotenv from 'dotenv';
dotenv.config();
const secrets = {
    PORT : process.env.PORT,
    MONGODB_URI : process.env.MONGODB_URI,
    STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
    CLIENT_URL:process.env.CLIENT_URL,
    WEBHOOK_SECRET : process.env.WEBHOOK_SECRET
    

}
export default secrets;