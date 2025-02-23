import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { 
    addPost, 
    bookmarkPost, 
    comments, 
    deletePost, 
    dislikePost, 
    getAllPost, 
    getAllPostComments, 
    getNoOfPost, 
    likePost 
} from "../controllers/post.controller.js";

const router = Router();

router.route("/addpost").post(verifyToken, upload.single('image'), addPost);
router.route("/all").get(verifyToken, getAllPost);
router.route("/user/all").get(verifyToken, getNoOfPost);
router.route("/:id/like").get(verifyToken, likePost);
router.route("/:id/dislike").get(verifyToken, dislikePost);
router.route("/:id/comment").post(verifyToken, comments);
router.route("/:id/comment/all").get(verifyToken, getAllPostComments);
router.route("/delete/:id").delete(verifyToken, deletePost);
router.route("/:id/bookmark").post(verifyToken, bookmarkPost);

export default router;
