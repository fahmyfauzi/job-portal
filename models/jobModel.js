import mongoose from "mongoose";
import User from "./userModel.js";
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is require"],
    },
    position: {
      type: String,
      required: [true, "Job position is require"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Jakarta",
      required: [true, "Work location is require"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
