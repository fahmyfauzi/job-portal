//imports package
import express from "express";

//imports file
import userAuth from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//imports file
import testController from "../controllers/testController.js";

// authentication menggunakan userAuth
router.post("/test-post", userAuth, testController);

export default router;
