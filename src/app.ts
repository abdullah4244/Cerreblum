import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRouter';
import categoryRouter from './routes/categoryRouter';
import subjectRouter from './routes/subjectRouter';
dotenv.config();

const app = express();
app.use(express.json())
app.use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
    })
  );
  app.use("/upload", express.static("./storage/upload"));

app.use("/api/v1/user", userRouter);
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/subject',subjectRouter)
export default app;