import React, { useState, useRef  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toastUtils";
import { setAuthUser } from "../Redux/authSlice.js";
import axios from "axios";
import { readFileDataURL } from "../utils/dataURL.js";


function EditProfile() {
  const { user, userProfile } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [avatar, setavatar] = useState(user?.avatar)
   const [imagePreview, setimagePreview] = useState("");
   const [updatingAvatar, setupdatingAvatar] = useState(false)
   const [changebtn, setchangebtn] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();



  const fileHandler = async (e) => {
    const avatar = e.target.files?.[0];
    if (avatar) {
      setavatar(avatar);
      const dataURI = await readFileDataURL(avatar);
      setimagePreview(dataURI);
    }
  };



const changeButton = async () => {
  
imageRef.current.click()
setchangebtn(true)
}



const updateAvatar = async () => {
  console.log("Updating avatar...");
  setupdatingAvatar(true);
  
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await axios.post(
      "http://localhost:7000/api/v1/users/avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );


  console.log("Updated Avatar Data:", response.data.data); 

  const updatedAvatar = {
    ...userProfile,
    avatar: response.data.data.user?.avatar 
  };

  dispatch(setAuthUser(updatedAvatar));
  showToast("Avatar updated successfully!", "success");
 

    setchangebtn(false);
    navigate(`/profile/${user?._id}`);
  } catch (error) {
    console.error("Avatar Update Error:", error);
    showToast("Error while updating avatar!", "error");
  } finally {
    setupdatingAvatar(false);
  }
};




  const [username, setusername] = useState("");
  const [fullName, setfullName] = useState("");
  const [bio, setbio] = useState("");








  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log(username, fullName, bio);
    
    try {
        setLoading(true);
        const response = await axios.post(
            "http://localhost:7000/api/v1/users/profile/edit",
            { username, fullName, bio },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        if (response.data.success) {
          
            const updatedUserData = {
                ...user,
                username: response.data.data.user?.username,  
                fullName: response.data.data.user?.fullName, 
                bio: response.data.data.user?.bio,       
            };

            console.log("Updated User Data:", updatedUserData); 

            dispatch(setAuthUser(updatedUserData)); 
            navigate(`/profile/${user?._id}`);
            showToast(`Profile Updated Successfully!`, "success");
        }
    } catch (error) {
        console.error("Update Error:", error);
        showToast("Error while updating profile", "error");
    } finally {
        setLoading(false);
    }
};







  return (
    <div className="h-screen flex max-w-2xl flex-col gap-5 mx-auto pl-10">
      <h1 className="font-semibold text-3xl">Edit Profile</h1>



    <div className='bg-slate-700 w-full h-20 rounded-md flex justify-between p-3 items-center'>

      <div >

        <img  src={imagePreview ? imagePreview : user?.avatar} className='w-16 h-16 rounded-full object-cover' alt="" />

   
<input 
ref={imageRef} 
className="hidden" 
type="file" 
onChange={fileHandler} 
/>


      </div>
      {
        !changebtn ? <button 
        onClick={changeButton}
        className='bg-slate-500 px-2 py-1 rounded-md font-semibold'>Select avatar</button>
        :
        <button 
      onClick={updateAvatar}
      className={`bg-blue-500 px-2 py-1 rounded-md font-semibold ${updatingAvatar && "animate-pulse"}`}>Update</button>
      }

    </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-5">
        <div className="flex gap-2 flex-col">
          <h1 className="font-semibold text-xl">Username</h1>
          <input
            onChange={(e) => setusername(e.target.value)}
            value={username}
            className="bg-slate-700 outline-none py-2 px-3 rounded-md"
            type="text"
            placeholder="Username"
            required
          />
        </div>

        <div className="flex gap-2 flex-col">
          <h1 className="font-semibold text-xl">Full Name</h1>
          <input
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
            className="bg-slate-700 outline-none py-2 px-3 rounded-md"
            type="text"
            placeholder="Full Name"
          />
        </div>

        <div className="flex gap-2 flex-col">
          <h1 className="font-semibold text-xl">Bio</h1>
          <textarea
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            className="bg-slate-700 outline-none max-h-40 py-2 px-3 rounded-md"
            placeholder="Express yourself"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 px-3 py-2 rounded-lg font-semibold ${
            loading ? "animate-pulse opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
