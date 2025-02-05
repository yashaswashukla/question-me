import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    // console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected Successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit();
  }
}
