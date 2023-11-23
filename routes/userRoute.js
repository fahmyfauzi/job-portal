//import packages
import express from "express";

//import file
import userAuth from "../middlewares/authMiddleware.js";
import updateUserController from "../controllers/userController.js";
const router = express.Router();

// GET USER || GET

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUserController);

export default router;
