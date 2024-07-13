import mongoose from 'mongoose';
import app from "./app";
import { User } from './models/User';
import secrets from './utils/config';

const port = secrets.PORT;
mongoose.connect(secrets.MONGODB_URI as string).then(async ()=>{
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}).catch((err)=>{
    console.log(err)
})
