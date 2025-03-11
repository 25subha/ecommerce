import  { Router } from "express";
import {  creatUser, getAllUser, loginUser, updateUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/ragister").post(creatUser)
router.route("/login").post(loginUser)
router.route("/update_acountdetails/:_id").put(updateUser)
router.route("/alluser").post(getAllUser)
// router.route("/change_password").patch(changedPassword)
export default router;