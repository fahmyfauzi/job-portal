//import packages
import express from "express";

//import files
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  getJobsControoler,
  updateJobController,
  deleteJobController,
  jobStatesController,
} from "../controllers/jobController.js";

//object route
const router = express.Router();

//create job
router.post("/create-job", userAuth, createJobController);

//get job
router.get("/get-job", userAuth, getJobsControoler);

//update job
router.patch("/update-job/:id", userAuth, updateJobController);

//delete job
router.delete("/delete-job/:id", userAuth, deleteJobController);

//stats
router.get("/job-stats", userAuth, jobStatesController);
export default router;
