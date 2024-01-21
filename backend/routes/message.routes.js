import express from "express";
import { getMessage, markAsReadMessage, sendMessage } from "../controller/messageController";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/send/:receriverId").post(verifyJwt,sendMessage);
router.route("/all/:id").get(verifyJwt,getMessage);
router.route("/read/:id").put(verifyJwt,markAsReadMessage);

export default router;