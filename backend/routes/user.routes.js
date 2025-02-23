import { Router } from "express";
import { login, logout, register, updateProfileDetails, updateProfileImage, getSuggestedUsers, getProfile, followUser, unfollowUser } from "../controllers/user.controllers.js";
import {verifyToken} from "../middleware/auth.middleware.js"
import upload  from "../middleware/multer.middleware.js"





const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post( logout)

router.route("/:id/profile").get(verifyToken, getProfile)
router.route("/userSuggestion").get(verifyToken, getSuggestedUsers);


router.route("/profile/edit").post(verifyToken, updateProfileDetails)
router.route("/avatar").post(verifyToken, upload.single("avatar"), updateProfileImage)

// router.route("/followUnfollow/:id").post(verifyToken, followUnfollow)
router.route("/unfollow/:id").put(verifyToken, unfollowUser )
router.route("/follow/:id").put(verifyToken, followUser )






export default router;