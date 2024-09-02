import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/users.js";

const port = 3000;

const app = express();
dotenv.config();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to MongoDB
mongoose.connect(
  `mongodb+srv://eik:${process.env.MONGOOSE_PASSWORD}@dbeats.8elky.mongodb.net/?retryWrites=true&w=majority&appName=DBeats`
);

//Routes
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
