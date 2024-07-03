import mongoose from 'mongoose';
import app from "./app";
import { User } from './models/User';

const port = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI as string).then(async ()=>{
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}).catch((err)=>{
    console.log(err)
})
