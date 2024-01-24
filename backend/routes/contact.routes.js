import express from "express"
import { createContact, getAllContact } from "../controller/ContactController.js"
import { isAdmin, verifyJwt } from "../middleware/auth.middleware.js"

const router=express.Router();

router.route("/create-contact").post(createContact)
router.route("/admin/all-contact").get(verifyJwt,isAdmin, isAdmin,getAllContact)  //admin need to change later

export default router