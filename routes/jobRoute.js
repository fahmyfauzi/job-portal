//import packages
import express from "express";

//import files
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  getJobsControoler,
} from "../controllers/jobController.js";

//object route
const router = express.Router();

router.post("/create-job", userAuth, createJobController);

router.get("/get-job", userAuth, getJobsControoler);
export default router;
