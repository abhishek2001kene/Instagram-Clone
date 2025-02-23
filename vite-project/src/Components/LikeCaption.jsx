import React, { useState } from "react";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { FiMessageCircle } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";

function LikeCaption({
  like, setlike,
  post, 
  Postcomments, setPostcomments,
  likeCount, setlikeCount,
  likeDislikePost,
}) 

{
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLikeClick = async () => {
    setIsAnimating(true);
    await likeDislikePost();
    setTimeout(() => setIsAnimating(false), 10);
  };

  return (
    <div className="w-full py-2">
      <div className="flex justify-between items-center p-1 bg-orange-30 w-full">
        <div className="gap-3">
          <div className="flex gap-3">
            {like ? (
              <GoHeartFill 
                onClick={handleLikeClick} 
                className="text-red-600 cursor-pointer" 
                size={30}  
              />
            ) : (
              <GoHeart
                onClick={handleLikeClick}
                className={`cursor-pointer transition-transform duration-10 ${isAnimating ? "scale-125" : "scale-10"}`}
                size={30}
              />
            )}
            <FiMessageCircle size={30} onClick={() => setPostcomments(!Postcomments)} />
          </div>
        </div>

        <span>
          <IoBookmarkOutline size={30} />
        </span>
      </div>

      <span className="relative font-semibold left-3">{likeCount} likes</span>

      <div className="flex gap-2 w-full relative px-1">
        <h1 className="font-bold cursor-pointer">
         {post?.author?.[0]?.username}
        </h1>
        <p>{post.caption}</p>
      </div>
    </div>
  );
}

export default LikeCaption;
