import React, { useContext, useRef, useState } from "react";
import { readFileDataURL } from "../utils/dataURL.js";
import popupContext from "../Context/popupContext";
import axios from "axios";
import { showToast } from '../utils/toastUtils.js'
import {useSelector, useDispatch} from "react-redux"
import {setPosts} from "../Redux/PostSlice.js"


function CreatePostPopup() {
  const { showPopup, setshowPopup } = useContext(popupContext);
  const imageRef = useRef();
  const {user} = useSelector(store=> store.auth)
  const {posts} = useSelector(store=> store.post)
  const dispatch = useDispatch();


  const [file, setfile] = useState("");
  const [caption, setcaption] = useState("");
  const [imagePreview, setimagePreview] = useState("");
  const [resize, setresize] = useState(true);
  const [loading, setloading] = useState(false);





  const fileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setfile(file);
      const dataURI = await readFileDataURL(file);
      setimagePreview(dataURI);
    }
  };


  
  const handlePost = async () => {
    try {
      setloading(true);

      const response = await axios.post(
        "http://localhost:7000/api/v1/post/addpost",
        { caption, image: file },
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
      
        dispatch(setPosts([response.data.data, ...posts]));
        setshowPopup(false);
        showToast("Post uploaded successfully", "success");
      }
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!", "error"); 
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="popup rounded-lg w-[40%] z-50 h-[92%] bg-slate-900 shadow-sm shadow-slate-400 flex flex-col fixed top-10">
      <div
        onClick={() => setshowPopup(false)}
        className="font-bold absolute right-3 text-slate-400 hover:text-slate-100"
      >
        ✕
      </div>

      <div className="flex flex-col gap-4 p-4 h-full">
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt="profile"
            className="h-10 w-10 bg-slate-600 rounded-full object-cover"
          />
          <h1>{user.username}</h1>
        </div>
        <textarea
          className="w-full h-28 border bg-slate-800 border-gray-400 rounded-lg p-2"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setcaption(e.target.value)}
        ></textarea>

        <input ref={imageRef} className="hidden" type="file" onChange={fileHandler} />
        <button
          onClick={() => imageRef.current.click()}
          className="bg-blue-600 p-2 font-semibold rounded-lg text-white"
        >
          Select Image
        </button>

        {imagePreview && (
          <div className="rounded-lg w-full h-[52%] bg-slate-100">
            <img
              onClick={() => setresize(!resize)}
              src={imagePreview}
              className={`w-full h-full rounded-md ${
                resize ? "object-contain" : "object-cover"
              }`}
              alt="Preview"
            />
          </div>
        )}

        {imagePreview && (
          <button
            onClick={handlePost}
            type="submit"
            className={`bg-blue-600 ${loading && 'animate-pulse'} p-2 w-[92%] absolute bottom-3 font-semibold rounded-lg text-white`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CreatePostPopup;
