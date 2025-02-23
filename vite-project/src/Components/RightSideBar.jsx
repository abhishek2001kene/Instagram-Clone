import React from "react";
import { useSelector } from "react-redux";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";

function RightSideBar() {


  const { user, suggestedUser } = useSelector((store) => store.auth);
  

  return (
    <div className="bg-slate-900 shadow-md p-5 shadow-neutral-50 w-1/3 hidden md:block">
      <div className="gap-3 fixed top-0 w-full mt-5">
        <div className="w-full h-full flex gap-3  ">
          <Link to={`/profile/${user?._id}`}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <RxAvatar size={40} className="text-gray-400" />
            )}
          </Link>

          <div>
            <h1>
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <p className="overflow-hidden text-slate-400 text-ellipsis break-words line-clamp-2">{user?.bio}</p>
          </div>
        </div>

      
        <div>
          <p className="my-5">Suggested Users</p>
          {suggestedUser?.length > 0 ? ( 
            suggestedUser.map((user) => (  
              <div key={user._id} className="flex relative gap-3 w-1/3 items-center p-3 border-b">
              <div className="flex gap-3 ">
              <Link to={`/profile/${user._id}`} className="flex gap-4 items-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <RxAvatar size={34} className="text-gray-400" />
                  )}
                   <div>
                  <h2>{user.username}</h2>
                  <p className="text-slate-400">{user.bio || "Bio here..."}</p>
                </div>
                </Link>
               
              </div>
              <button className="absolute right-9 px-3 text-sm bg-blue-500 py-1 rounded-xl font-semibold">Follow</button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No suggested users available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightSideBar;
