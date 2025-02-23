import React from "react";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";

function Messages({selectedUser}) {
  console.log(selectedUser)
  return (
    <div className=" text-white p-4 h-[calc(109vh-140px)] overflow-y-auto hide-scrollbar">


<div className="flex justify-center mt-20"> 
<div className="flex flex-col gap-2 items-center justify-center">

 {    
 
 selectedUser.avatar ? (
                  <img
                    src={selectedUser?.avatar}
                    alt="profile"
                    className="h-28 w-28 object-cover rounded-full"
                  />
                  
                ) : (
                  <RxAvatar size={120} className="text-gray-400" />
                )}

                <h1  className="text-2xl font-semibold">{selectedUser.fullName}</h1>
                <h1>{selectedUser.username}</h1>

            <Link to={`/profile/${selectedUser._id}`}>    <button className="px-3 py-2 bg-slate-700 rounded-xl">Viwe Profile</button></Link>
 </div>
 
</div>

<div className='flex flex-col gap-3'>
  {
    [1,2,3,4].map((msg) => {
      return (
        <div className={`flex`}>
          <div>
            {msg}
          </div>
        </div>
      )
    })
  }
</div>


    </div>
  );
}

export default Messages;
