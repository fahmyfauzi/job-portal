//imports package
import express from "express";

//router object
const router = express.Router();

//imports file
import testController from "../controllers/testController.js";

router.post("/test-post", testController);

export default router;
