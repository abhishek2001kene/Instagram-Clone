import React, { useState, useEffect } from "react";
import useUserProfile from "../hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RxAvatar } from "react-icons/rx";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FiMessageCircle } from "react-icons/fi";
import axios from "axios";
import { setUserProfile, setAuthUser } from '../Redux/authSlice.js';

function Profile() {
  const params = useParams();
  const userId = params.id;
  useUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const logonUser = userProfile?._id === user?._id;

 
 

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [userProfile, user]);

  
  const [isFollowing, setIsFollowing] = useState(false); 
  // const [followersCount, setFollowersCount] = useState(userProfile.followers.length); 

useEffect(() => {
    
    setIsFollowing(userProfile.followers.includes(user._id));
}, [userProfile, user]); 






const handleFollow = async () => {
  try {
      const response = await axios.put(
          `https://instagram-clone-1-ag8w.onrender.com/api/v1/users/follow/${userProfile._id}`,
          {},
          { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data.data)
          setIsFollowing(true); // Update local state
          setFollowersCount((prev) => prev + 1); // Update UI immediately

          // Update userProfile in Redux
          dispatch(setUserProfile({
              ...userProfile,
              followers: [...userProfile.followers, user._id] // Add current user ID to followers array
          }));
      }
  } catch (error) {
      console.error("Error following:", error);
  }
};

const handleUnfollow = async () => {
  try {
      const response = await axios.put(
          `https://instagram-clone-1-ag8w.onrender.com/api/v1/users/unfollow/${userProfile._id}`,
          {},
          { withCredentials: true }
      );

      if (response.status === 200) {
          setIsFollowing(false); 
          setFollowersCount((prev) => prev - 1); 

       
          dispatch(setUserProfile({
              ...userProfile,
              followers: userProfile.followers.filter(id => id !== user._id) 
          }));
      }
  } catch (error) {
      console.error("Error unfollowing:", error);
  }
};

console.log(userProfile);




  const handleTabs = (tab) => {
    setActivTab(tab);
  };

  const [activTab, setActivTab] = useState("posts");
  const content = activTab === "posts" ? userProfile?.Posts ?? [] : userProfile?.bookmarks ?? [];

  return (
    <div className="flex max-w-4xl relative w-full h-screen justify-center mx-auto pl-10 overflow-x-auto hide-scrollbar">
      <section className="flex flex-col w-full h-full">
        <div className="flex gap-28 border-b border-slate-600 justify-center w-full min-h-auto pb-4">
          <div className="flex gap-28 justify-center w-full mt-9">
            <div>
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="profile"
                  className="h-40 w-40 rounded-full object-cover"
                />
              ) : (
                <RxAvatar size={175} className="font-thin" />
              )}
            </div>
            <div className="flex flex-col gap-9">
              <div className="flex gap-6">
                <h1 className="font-bold text-2xl">{userProfile?.username}</h1>
                {logonUser ? (
                  <Link to={"/account/edit"}>
                    <button className="px-3 py-1 h-9 rounded-lg bg-slate-600 font-semibold">
                      Edit Profile
                    </button>
                  </Link>
                ) : (
                  <div className="flex gap-2">
                 
                 <button
  onClick={isFollowing ? handleUnfollow : handleFollow}
  className="px-3 font-semibold py-1 h-9 rounded-lg bg-slate-600"
>
  {isFollowing ? 'Unfollow' : 'Follow'}
</button>

                    {!isFollowing && (
                      <button className="px-3 font-semibold py-1 h-9 rounded-lg bg-slate-600">
                        Message
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-16">
                <h2>
                  <span className="font-bold">{userProfile?.Posts?.length ?? 0}</span> posts
                </h2>
                <h2>
                  <span className="font-bold">{userProfile?.
followers
?.length ?? 0}</span> followers
                </h2>
                <h2>
                  <span className="font-bold">{userProfile?.followings?.length ?? 0}</span> following
                </h2>
              </div>
              <div>
                <h1 className="font-bold text-xl">{userProfile?.fullName}</h1>
                <p>{userProfile?.bio || "Bio here....."}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-semibold p-5 flex gap-16 justify-center items-center">
            <span
              onClick={() => handleTabs("posts")}
              className={`cursor-pointer flex gap-2 justify-center items-center ${
                activTab === "posts" ? "text-white" : "text-slate-500"
              }`}
            >
              <BsGrid3X3GapFill />
              <h1>POST</h1>
            </span>
            <span
              onClick={() => handleTabs("saved")}
              className={`cursor-pointer flex gap-2 justify-center items-center ${
                activTab === "saved" ? "text-white" : "text-slate-500"
              }`}
            >
              <FaSave />
              <h1>SAVED</h1>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {content.length > 0 ? (
              content.map((post) => (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img src={post?.image} alt="posts" className="aspect-square object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                    <div className="flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex flex-col items-center">
                        <GoHeartFill size={30} />
                        <h1>{post?.likes.length}</h1>
                      </span>
                      <span className="flex flex-col items-center">
                        <FiMessageCircle size={30} />
                        <h1>{post?.Comments.length}</h1>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center p-4">No content available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}







export default Profile;
