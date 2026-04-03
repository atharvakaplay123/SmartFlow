import mongoose from "mongoose";
import "dotenv/config"
export async function Connect_MongoDB() {
    try {
        if (!process.env.MONGO_DB_CONNECTION_STRING) {
            console.error("String Not Found")
        }
        const string = process.env.MONGO_DB_CONNECTION_STRING!
        await mongoose.connect(string)
        console.log("MongoDB Connected")
    } catch (e) {
        console.error(e)
    }
}