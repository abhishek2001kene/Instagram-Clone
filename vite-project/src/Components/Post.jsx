import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";
import PostComments from "./PostComments";
import LikeCaption from "./LikeCaption";
import PostDialogBox from "./PostDialogBox";
import { useSelector, useDispatch } from "react-redux";
import { showToast } from "../utils/toastUtils.js";
import axios from "axios";
import { setPosts } from "../Redux/PostSlice.js";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [DialogBox, setDialogBox] = useState(false);
  const [Postcomments, setPostcomments] = useState(false);
  const [resize, setresize] = useState(true); // Default to `true`
  const [like, setlike] = useState(post.likes.includes(user?._id) || false);
  const [likeCount, setlikeCount] = useState(post.likes.length);

  const likeDislikePost = async () => {
    try {
      const action = like ? "dislike" : "like";

      const response = await axios.get(
        `http://localhost:7000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (response.data) {
        const updatedLikeCount = like ? likeCount - 1 : likeCount + 1;
        setlikeCount(updatedLikeCount);
        setlike(!like);



        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      showToast("Something went wrong!", "error");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-900 border-b border-slate-500 my-3 md:max-w-sm mx-auto">
      <div className="flex justify-between relative md:py-2 py-1 md:px-0 px-3 w-full items-center">
      <Link to={`/profile/${post.author?.[0]?._id}`}>
        <div className="flex gap-3 justify-between items-center">
         
            <div className="h-12 border w-12 bg-slate-600 rounded-full flex items-center justify-center">
              {post.author?.[0]?.avatar ? (
                <img
                  src={post.author[0].avatar}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <RxAvatar size={40} className="text-gray-400" />
              )}
            </div>
          
          <h1>{post.author?.[0]?.username || "Unknown User"}</h1>
          
        </div>
        </Link>
        

        <IoIosMore
          className="z-40 cursor-pointer"
          onClick={() => setDialogBox(!DialogBox)}
        />
        {DialogBox && (
          <div className="absolute right-4 top-10">
            <PostDialogBox
              postAuthorid={post?.author?.[0]?._id}
              postId={post._id}
            />
          </div>
        )}
      </div>

      <img
        src={post.image}
        onDoubleClick={likeDislikePost}
        onMouseOver={() => setresize(false)}
        onMouseLeave={() => setresize(true)}
        className={`aspect-square bg-slate-800 ${
          resize ? "object-cover" : "object-contain"
        }`}
        alt="Post Image"
      />

      <div className="relative left-0 w-full md:px-0 px-2">
        <LikeCaption
          likeCount={likeCount}
          setlikeCount={setlikeCount}
          like={like}
          setlike={setlike}
          post={post}
          Postcomments={Postcomments}
          setPostcomments={setPostcomments}
          likeDislikePost={likeDislikePost}
        />

        <PostComments
          post={post}
          Postcomments={Postcomments}
          setPostcomments={setPostcomments}
        />
      </div>
    </div>
  );
}

export default Post;
