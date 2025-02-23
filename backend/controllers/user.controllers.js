import { asyncHandler } from "../utiles/asynHandler.js";
import { ApiError } from "../utiles/apiError.js";
import { apiResponse } from "../utiles/apiResponse.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utiles/dataUri.js";
import cloudinary from "../utiles/cloudinary.js";
import { Post } from "../models/post.model.js";

const register = asyncHandler(async (req, res) => {
const { username, email, password } = req.body;

console.log(req.body);

if (!username || !email || !password) {
    throw new ApiError(404, "All fields are required");
}

const existedUser = await User.findOne({ email });

if (existedUser) {
    throw new ApiError(401, "User already exist with this email ID.");
}

const newUser = await User.create({
    username,
    email,
    password,
});

const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
);

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
}

return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registers successfully"));
});

const options = {
httpOnly: true,
sameSite: "strict",
maxAge: 1 * 24 * 60 * 60 * 1000,
secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
} catch (error) {
    // throw new ApiError(500, "Something went wrong while generating refresh and access token")
    // // next(res.status(401).json(
    //     new ApiError(401, error, error?.message))
    // )
    throw new ApiError(
    error?.status || 501,
    error?.message || "Error During Generatitng Tokens"
    );
}
};




const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(401, "All fields are required");
    }

    const UserExisted = await User.findOne({ email });

    if (!UserExisted) {
        throw new ApiError(404, "User not exist");
    }

    const passwordCheck = await UserExisted.isPasswordCorrect(password);

    if (!passwordCheck) {
        throw new ApiError(404, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        UserExisted._id
    );

    const loggedInUser = await User.findById(UserExisted._id).select(
        "-password -refreshToken"
    );


    const populatePosts = UserExisted.posts 
        ? await Promise.all(
            UserExisted.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return post?.author.equals(UserExisted._id) ? post : null;
            })
        ).then(posts => posts.filter(Boolean)) 
        : [];


    const options = {
        // httpOnly: true,
        // sameSite: "Strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                    posts: populatePosts,
                },
                "User logged in successfully"
            )
        );
});






const logout = asyncHandler(async (req, res) => {
try {
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    return res.json(new apiResponse(200, "User logged out successfully"));
} catch (error) {
    console.log(error);
    throw new ApiError(500, "Error while logging out");
}
});

const getProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;


        let user = await User.findById(userId)
            .select("-password -refreshToken")
            .populate({
                path: "Posts",
                options: { sort: { createdAt: -1 } }, 
            })
            .populate("bookmarks")
        

        if (!user) {
            return res.status(404).json(new apiResponse(404, null, "User not found"));
        }

        return res.status(200).json(new apiResponse(200, user, "User profile fetched successfully"));
    } catch (error) {
        console.error("While fetching profile:", error);
        return res.status(500).json(new apiResponse(500, null, "Internal Server Error"));
    }
});



const updateProfileDetails = asyncHandler(async (req, res) => {
const { bio, username, fullName } = req.body;

if (!username) {
    throw new ApiError(400, "Username is required to update");
}

const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
    $set: {
        ...(bio !== undefined && { bio }),
        ...(username !== undefined && { username }),
        ...(fullName !== undefined && { fullName }),
        
    },
    },
    {
    new: true,
    }
).select("-password");

if (!user) {
    return res
    .status(500)
    .json(new ApiError(501, "Server Error! Information Not Update"));
}

return res.status(200).json(
    new apiResponse(
    200,
    {
        ...(bio !== undefined ? { bio } : {}),
        ...(username !== undefined ? { username } : {}),
        ...(fullName !== undefined ? { fullName } : {}),
        
    },
    "Profile Details updated"
    )
);
});



const updateProfileImage = asyncHandler(async (req, res) => {
    try {
    const userId = req.user.id; 
    const avatar = req.file; 

    if (!userId) {
        return res.status(404).json({ message: "User not found" });
    }

    let cloudResponse = null;
    if (avatar) {
        const fileUri = getDataUri(avatar); 
        cloudResponse = await cloudinary.uploader.upload(fileUri);  

        if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({ message: "Failed to upload avatar to Cloudinary" });
        }
    }

    const user = await User.findById(userId).select("-password -refreshToken");;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (cloudResponse) {
        user.avatar = cloudResponse.secure_url; 
    }

    await user.save(); 

    return res.status(200).json({
        status: 200,
        data: user,
        message: "Profile image updated successfully",
    });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});





const getSuggestedUsers = asyncHandler(async (req, res) => {
    try {
    const suggestedUsers = await User.find({
        _id: { $ne: req.user.id }, 
    }).select("-password -refreshToken"); 

    return res.status(200).json(new apiResponse(200, suggestedUsers)); 
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" }); 
    }
});






const followUser = asyncHandler(async (req, res) => {
    try {
    const WhoFollowing = req.user.id;
    const ToFollow = req.params.id;

    if (WhoFollowing === ToFollow) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const user = await User.findById(WhoFollowing);
    const targetUser = await User.findById(ToFollow);

    if (!user || !targetUser) {
        throw new ApiError(400, "User not found");
    }

    if (user.followings.includes(ToFollow)) {
        throw new ApiError(400, "You are already following this user");
    }

    await Promise.all([
        User.updateOne({ _id: WhoFollowing }, { $push: { followings: ToFollow } }),
        User.updateOne({ _id: ToFollow }, { $push: { followers: WhoFollowing } }),
    ]);

    const updatedUser = await User.findById(WhoFollowing).populate("followers", "username avatar") 
    .populate("followings", "username avatar");




    return res.status(200).json({ message: "Followed successfully", user: updatedUser });
    } catch (error) {
    console.error("Error while following:", error);
    res.status(500).json({ message: "Internal Server Error" });
    }
});



const unfollowUser = asyncHandler(async (req, res) => {
    try {
    const WhoFollowing = req.user.id;
    const ToUnfollow = req.params.id;

    if (WhoFollowing === ToUnfollow) {
        throw new ApiError(400, "You cannot unfollow yourself");
    }

    const user = await User.findById(WhoFollowing);
    const targetUser = await User.findById(ToUnfollow);

    if (!user || !targetUser) {
        throw new ApiError(400, "User not found");
    }

    if (!user.followings.includes(ToUnfollow)) {
        throw new ApiError(400, "You are not following this user");
    }

    await Promise.all([
        User.updateOne({ _id: WhoFollowing }, { $pull: { followings: ToUnfollow } }),
        User.updateOne({ _id: ToUnfollow }, { $pull: { followers: WhoFollowing } }),
    ]);

    const updatedUser = await User.findById(WhoFollowing).populate("followers", "username avatar") 
    .populate("followings", "username avatar"); 



    return res.status(200).json({ message: "Unfollowed successfully", user: updatedUser });
    } catch (error) {
    console.error("Error while unfollowing:", error);
    res.status(500).json({ message: "Internal Server Error" });
    }
});







export {
register,
login,
logout,
getProfile,
updateProfileDetails,
updateProfileImage,
getSuggestedUsers,
followUser,
unfollowUser

// followUnfollow,
};
