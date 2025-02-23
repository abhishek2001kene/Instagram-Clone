import React, { useState, useEffect, useContext } from "react";
import { GoHome } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";
import { LuMessageCircleCode } from "react-icons/lu";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FiPlusSquare } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import popupContext from "../Context/popupContext.js"





function Sidebar() {


  const { showPopup, setshowPopup } = useContext(popupContext); 
  const { user } = useSelector(store => store.auth)

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutHandler = async () => {
  
    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
     
        navigate("/login");
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarItemHandler = async (textType) => {
    
    if (textType === "Logout") await logoutHandler();

    if (textType === "Create") await setshowPopup(!showPopup)
    
    if (textType === "Profile") {
        navigate(`/profile/${user?._id}`)
      }
    if (textType === "Home") {
        navigate(`/home`)
      }
    if (textType === "Messages") {
        navigate(`/chat`)
      }

};




  const sideItems = [
    { icon: <GoHome size={30} />, text: "Home" },
    { icon: <CiSearch size={30} />, text: "Search" },
    { icon: <IoIosTrendingUp size={30} />, text: "Explore" },
    { icon: <LuMessageCircleCode size={30} />, text: "Messages" }, 
    !isMobile && { icon: <IoIosHeartEmpty size={30} />, text: "Notification" }, 
    !isMobile && { icon: <FiPlusSquare size={30}  />, text: "Create" },
    !isMobile && { icon: <IoLogOutOutline size={30} />, text: "Logout" },
    { 
      icon: user?.avatar ? (
          <img 
              src={user.avatar}  
              alt="profile" 
              className="h-10 w-10 bg-slate-600 rounded-full object-cover" 
          />
      ) : (
          <RxAvatar size={35} />
      ), 
      text: "Profile"  
  },

  ].filter(Boolean); 




  return (
    <div className="bg-slate-900  flex md:flex-col w-full gap-3 md:h-screen md:border-r fixed md:top-0 md:left-0 md:w-[16%] md:pl-6 md:py-6 py-2 md:border-slate-600 text-white bottom-0 z-20 border-t-2 border-slate-300">
    
      <h1 className="font-bold text-3xl mb-5 md:block hidden">Instagram</h1>

      {sideItems.map((item, index) => (
        <div
          onClick={() => sidebarItemHandler(item.text)}
          key={index}
          className="flex  rounded pl-3 md:pl-2 w-[96%] md:justify-start md:items-center cursor-pointer py-1 gap-2 text-lg hover:bg-slate-800"
        >
          {item.icon}
          <span className="p-2 md:block hidden">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
