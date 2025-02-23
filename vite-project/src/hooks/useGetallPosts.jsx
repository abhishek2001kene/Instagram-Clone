import React,{useEffect} from 'react'
import axios from "axios"
import {useDispatch} from "react-redux"
import {setPosts} from "../Redux/PostSlice.js"


function useGetallPosts() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const getAllPost = async () => {
            try {
                const response = await axios.get('https://instagram-clone-1-ag8w.onrender.com/api/v1/post/all',
                    {
                        withCredentials:true
                    }
                )

                if (response.data.success) {
                    dispatch(setPosts(response.data.data))
                }

             

            } catch (error) {
                console.log(error)
            }
        }
        getAllPost()
    },[])
}

export default useGetallPosts