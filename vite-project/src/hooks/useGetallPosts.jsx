import React,{useEffect} from 'react'
import axios from "axios"
import {useDispatch} from "react-redux"
import {setPosts} from "../Redux/PostSlice.js"


function useGetallPosts() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const getAllPost = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/post/all',
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