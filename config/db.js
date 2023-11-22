import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connect to mongodb database ${mongoose.connection.host}`.bgMagenta.white
    );
  } catch (err) {
    console.log(`MongoDB Error ${err}`.bgRed.white);
  }
};

export default connectDB;
