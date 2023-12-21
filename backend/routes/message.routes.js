import express from "express";
import { getMessage, markAsReadMessage, sendMessage } from "../controller/messageController";

const router = express.Router();

router.route("/send").post(sendMessage);
router.route("/all/:id").get(getMessage);
router.route("/read/:id").put(markAsReadMessage);

export default router;