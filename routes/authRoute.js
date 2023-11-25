import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerController,
  loginController,
} from "../controllers/authController.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generate id of user collection
 *        name:
 *          type: string
 *          description: User name
 *        lastName:
 *          type: string
 *          description: User last name
 *        email:
 *          type: string
 *          description: User email address
 *        password:
 *          type: string
 *          description: User password should be greather then 6 character
 *        location:
 *          type: string
 *          description: user location city or country
 *      example:
 *        id: GDADGAHJALKON
 *        name: Asep
 *        lastName: saepulloh
 *        email: asepsaepulloh@gmail.com
 *        password: asep123
 *        location: indonesia
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *    summary: register new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: user created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: server internal error
 *
 */

//Register user
router.post("/register", limiter, registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Login page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: login successfull
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *      500:
 *        description: something went wrong
 */
//login user
router.post("/login", limiter, loginController);
export default router;
