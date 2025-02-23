import React from 'react'
import Post from "./Post"
import { useSelector } from 'react-redux'
import useGetallPosts from "../hooks/useGetallPosts";


export default function Posts() {


const {posts} = useSelector(store => store.post)


  return (
    <div className='flex flex-col '>
    {

    posts.map((post) => <Post key={post._id} post={post} /> )}
  


    </div>
  )
}




