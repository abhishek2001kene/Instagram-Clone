import React, { useContext } from "react";
import Feed from "../Components/Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "../Components/RightSideBar";
import useGetallPosts from "../hooks/useGetallPosts";
import useGetSuggestedUser from "../hooks/useGetSuggestedUser";






function Home() {


useGetallPosts()
useGetSuggestedUser()

  return (
    <div className="flex ">
      <div className="flex-grow">
        <Feed />
        <Outlet />
     

      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;
