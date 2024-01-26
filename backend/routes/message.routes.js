import express from "express";
import { deleteMessage, getMessage, markAsReadMessage, sendMessage } from "../controller/messageController.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/send/:receriverId").post(verifyJwt,sendMessage);
router.route("/all/:id").get(verifyJwt,getMessage);
router.route("/read/:id").put(verifyJwt,markAsReadMessage);
router.route("/delete/:id").delete(verifyJwt,deleteMessage);

export default router;
