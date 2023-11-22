//imports package
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is require"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is require"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is require"],
      minlength: [6, "Password length should be greater than 6 character"],
    },
    location: {
      type: String,
      default: "indonesia",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
