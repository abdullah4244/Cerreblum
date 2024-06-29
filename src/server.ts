import mongoose from 'mongoose';
import app from "./app";

const port = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI as string).then(()=>{
    console.log("DB connected")
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}).catch((err)=>{
    console.log(err)
})
