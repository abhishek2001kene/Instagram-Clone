import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { showToast } from '../utils/toastUtils.js'
import axios from 'axios';
import {setPosts} from "../Redux/PostSlice.js"


function PostDialogBox({ postAuthorid, postId}) {
  const [showDelete, setshowDelete] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id === postAuthorid) {
      setshowDelete(true);
    }
  }, [user, postAuthorid]); 


  const deletePost = async () => {
    try {

        const response = await axios.delete(`http://localhost:7000/api/v1/post/delete/${postId}`,
            { withCredentials: true,}) 


            if (response.data) {
               
                const updatedPosts = posts.filter((postItems)=>postItems?._id !== postId)
                dispatch(setPosts(updatedPosts));
                showToast("Post deleted successfully", "success")
            }
        
    } catch (error) {
        showToast("Error while deleting post.", "error")
    }
  }



  return (
    <div className="bg-slate-800 shadow-md shadow-blue-600 rounded-md">
      <ul className="p-2 font-semibold">
        <li onClick={deletePost} className='hover:text-red-400'>{showDelete ? "Delete" : "Unfollow"}</li>
      </ul>
    </div>
  );
}

export default PostDialogBox;
