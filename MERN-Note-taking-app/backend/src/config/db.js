import mongoose from "mongoose";

// in JS the only way to define a const function (a function that won't be overriden) is to define them in variable syntax
// JS doesn't have a "Final" keyword
export const connectDB = async () => {
    try {
        // connecing to mongoose might take a litlte bit of time, hence the "await"
        await mongoose.connect(process.env.MONGO_URI);

        /////////////////
        console.log("\n++++++++++++++++++++++++++++++++++++++\n Successfully connected to mongoDB!!\n++++++++++++++++++++++++++++++++++++++\n");
    } 
    catch (error) {
        console.log("Error connecting to mongodb: " + error);
        // if error when connecting to database, exit the program
        process.exit(1);
    }
};
