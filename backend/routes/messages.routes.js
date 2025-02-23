import { Router } from "express";
import {verifyToken} from "../middleware/auth.middleware.js"
import { getMessage, sendMessage } from "../controllers/message.controller.js";






const router = Router()

router.route("/sent/:id").post(verifyToken, sendMessage)
router.route("/all/:id").get(verifyToken, getMessage)

export default router