import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("database is connected!");
  } catch (err) {
    console.log(err.message);
  }
};

export default dbConnection;
