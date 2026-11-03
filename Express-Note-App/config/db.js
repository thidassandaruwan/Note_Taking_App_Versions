import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("+++++++++++++++++++++++++++ Connected to MongoDB +++++++++++++++++++++++++++++++++++++++++++++++");
    }
    catch(error){
        // print the error and exit the program
        console.error("Error connecting to mongoDB" + error);
        process.exit();
    }
}