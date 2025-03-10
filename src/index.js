import express, { json } from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import userRouter from "./routs/user.router.js";
import cors from "cors"
dotenv.config({
    path: "./env"
})

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());

app.use("/api/v1/user", userRouter)
//http://localhost:8000/api/v1/user/creatUser

try {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    
    const db = mongoose.connection;
    
    db.on("error", console.error.bind(console, "mongodb connection error"));
    db.once("open", () => {
        console.log("connected to database sucessfully!")
    })
    
    // app.get("/", function(req, res) {
    //     res.send("hello world")
    // })
    
    const port = process.env.PORT
    
    app.listen(port , "0.0.0.0", () => {
        console.log(`server start at port ${port}`)
    })
} catch (error) {
    console.error("ERROR", error)
    throw error
}