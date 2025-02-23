import mongoose from "mongoose";
import { asyncHandler } from "./utiles/asynHandler.js";





const connectDB = async () =>{
    try {
        const ConnectionMongo = await mongoose.connect(`${process.env.MONGO}/${process.env.DBname}`)
        console.log(`MongoDB Connected Succesfully`)
    } catch (error) {
        console.log("Something went wrong while connecting with the database = ",error)
        process.exit(1)
    }

    
}

export default connectDB
