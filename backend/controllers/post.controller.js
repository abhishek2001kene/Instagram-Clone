import { asyncHandler } from "../utiles/asynHandler.js";
import { ApiError } from "../utiles/apiError.js";
import { apiResponse } from "../utiles/apiResponse.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../utiles/cloudinary.js";
import { Comment} from "../models/comment.model.js";

const addPost = asyncHandler(async (req, res) => {
try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user.id;

    if (!image) {
    throw new ApiError(404, "Images required");
    }

    const optimizedImageBuffer = await sharp(image.buffer)
    .resize({ width: 800, height: 800, fit: "inside" })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    'base64'
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
    caption,
    image: cloudResponse.secure_url,
    author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
    user.Posts.push(post._id);
    await user.save();
    }

    await post.populate({ path: "author", select: "-password -refreshToken" });

    return res
    .status(200)
    .json(new apiResponse(200, post, "New posts added successfully"));
} catch (error) {
    console.log(error);
}
});




const getAllPost = asyncHandler(async (req, res) => {
try {
    const post = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username avatar" })
    .populate({
        path: "Comments",
        options: { sort: { createdAt: -1 } },
        populate: {
        path: "author",
        select: "username avatar",
        },
    });

    return res
    .status(200)
    .json(
        new apiResponse(200, post, "All posts are successfully fetched in feed")
    );
} catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while getting the posts");
}
});




const getNoOfPost = asyncHandler(async (req, res) => {
try {
    const authorId = req.user.id;
    const posts = await Post.find({ author: authorId })
    .sort({ createdAt: -1 })
    .populate({
        path: "author",
        select: "username avatar",
    })
    .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
        path: "author",
        select: "username avatar",
        },
    });

    return res
    .status(200)
    .json(
        new apiResponse(
        200,
        posts,
        "All posts are successfully fetched on profile"
        )
    );
} catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while like the posts ");
}
});




const likePost = asyncHandler(async (req, res) => {
try {
    const wholiked = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!postId) {
    throw new ApiError(404, "Post not found");
    }

    await post.updateOne({ $addToSet: { likes: wholiked } });
    await post.save();

    //we can use push but we want that howevwer how many times we click it counts only one like by ine user,

    return res.status(200).json(new apiResponse(200, post, "Post Liked"));
} catch (error) {
    console.log(error);
    throw new ApiError(
    500,
    "Something went wrong while getting the posts on profile"
    );
}
});



const dislikePost = asyncHandler(async (req, res) => {
try {
    const wholiked = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!postId) {
    throw new ApiError(404, "Post not found");
    }

    await post.updateOne({ $pull: { likes: wholiked } });
    await post.save();

    //we can use push but we want that howevwer how many times we click it counts only one like by ine user,

    return res.status(200).json(new apiResponse(200, post, "Post disliked"));
} catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while dislike the post");
}
});




const comments = asyncHandler(async (req, res) => {
try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
    throw new ApiError(400, "Text is required");
    }

    const comment = await Comment.create({
    text,
    author: userId,
    post: postId,
    });

    await comment.populate({ path: "author", select: "username avatar" });

    const post = await Post.findById(postId);
    if (!post) {
    throw new ApiError(404, "Post not found");
    }

    post.Comments.push(comment._id);
    await post.save();

    return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment added successfully"));
} catch (error) {
    console.error(error);
    throw new ApiError(500, "Error while commenting on the post");
}
});



const getAllPostComments = asyncHandler(async (req, res) => {
try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate("author","username avatar");

    if (!comments) {
    throw new ApiError(404, "comments not found");
    }

    return res
    .status(200)
    .json(new apiResponse(200, comments, "All post comments are feched successfully"));

} catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while Fetching all post comments");
}    

});



const deletePost = asyncHandler(async (req, res) => {
    
    try {
        const postId = req.params.id
        const authorId = req.user.id

        const post = await Post.findById(postId);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }


        if (post.author.toString() !== authorId) {
            throw new ApiError(403, "User is not authorised to delete the post");
        }

        await Post.findByIdAndDelete(postId);


        let user = await User.findById(authorId);

        user.Posts = user.Posts.filter(id => id.toString() !== postId.toString());
        await user.save();

        await Comment.deleteMany({ post: postId });



        return res.status(200).json(new apiResponse(200, null, "Post Deleted successfully"));


    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while deleting post comments");
    }

})




const bookmarkPost = asyncHandler(async (req, res) => {
    try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.bookmarks.includes(post._id)) {
        await user.updateOne({$pull:{bookmarks:post._id}})

        return res.status(200).json(
            new apiResponse(200, "Post unsaved successfully")
        );
    }else{
        await user.updateOne({$addToSet:{bookmarks:post._id}})

        return res.status(200).json(
            new apiResponse(200, "Post saved successfully")
        );
    }

   
    } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while bookmarking the post");
    }
});




export {
    addPost,
    getAllPost,
    getNoOfPost,
    likePost,
    dislikePost,
    comments,
    getAllPostComments,
    deletePost,
    bookmarkPost
}

