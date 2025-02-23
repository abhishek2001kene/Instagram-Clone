import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { SetSelectedUser } from "../Redux/authSlice.js";
import Messages from "./Messages.jsx";

function ChatPage() {
  const { user, suggestedUser, selectedUser } = useSelector(
    (store) => store.auth
  );


  const dispatch = useDispatch();

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-80 h-screen py-9 border-r border-slate-600">
        <Link to={`/profile/${user?._id}`}>
          <h1 className="font-bold px-5 text-xl">{user?.username}</h1>
        </Link>

        <div className="mt-7 overflow-y-auto hide-scrollbar">
          {suggestedUser?.length > 0 ? (
            suggestedUser.map((user) => {
              if (!user) return null; // ✅ Avoids error if `user` is undefined
         

              return (
                <div
                  onClick={() => dispatch(SetSelectedUser(user))}
                  key={user._id}
                  className="flex hover:bg-slate-800 relative gap-3 w-full items-center py-3 border-b border-slate-600 rounded px-3"
                >
                  <div className="flex gap-3">
                    <Link className="flex gap-4 items-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="profile"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <RxAvatar size={60} className="text-gray-400" />
                      )}
                      <div>
                        <h2>{user.username}</h2>
                        <p
                          className={`text-xs text-slate-600 font-medium`}
                        >
                      Offline
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No users available to chat</p>
          )}
        </div>
      </section>

      <section className="w-full flex flex-col">
        {selectedUser ? (
          <section>
            <div className="w-full flex items-center fixed top-0 bg-slate-800 border-b border-gray-600 h-20">
              <Link to={`/profile/${selectedUser?._id}`}>
                <div className="flex gap-3 items-center p-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt="profile"
                      className="h-14 w-14 object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar size={60} className="text-gray-400" />
                  )}

                  <h1 className="font-semibold">{selectedUser.username}</h1>
                </div>
              </Link>
            </div>

            <Messages selectedUser={selectedUser} />

            <div className="flex px-4 items-center w-full h-20 fixed bottom-0">
              <input
                type="text"
                placeholder="message..."
                className="px-6 py-3 rounded-3xl w-[65%] border border-gray-600 bg-slate-800"
              />
            </div>
          </section>
        ) : (
          <section></section>
        )}
      </section>
    </div>
  );
}

export default ChatPage;
