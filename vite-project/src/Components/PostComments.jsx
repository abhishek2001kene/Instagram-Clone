import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { showToast } from '../utils/toastUtils';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../Redux/PostSlice.js';
import { RxAvatar } from "react-icons/rx";

function PostComments({ post, Postcomments, setPostcomments }) {
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const [text, setText] = useState('');
    const [comments, setComments] = useState(post.comments || []);

    useEffect(() => {
        setComments(post.comments || []);
    }, [post.comments]);

    const getAllPostComments = async () => {
        try {
            const response = await axios.get(
                `http://localhost:7000/api/v1/post/${post._id}/comment/all`,
                { withCredentials: true }
            );
            if (response.data) {
                setComments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const postComment = async () => {
        if (!text.trim()) return;
        try {
            const response = await axios.post(
                `http://localhost:7000/api/v1/post/${post._id}/comment`,
                { text },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data) {
                showToast('Comment added successfully', 'success');
                setText('');

               
                getAllPostComments();

             
                const updatedPostdata = posts.map(p =>
                    p._id === post._id ? { ...p, comments: [...(p.comments || []), response.data.data] } : p
                );
                dispatch(setPosts(updatedPostdata));
            }
        } catch (error) {
            showToast('Error while commenting on post', 'error');
            console.error('Error while commenting:', error);
        }
    };

    return (
        <div className="w-full relative pl-1">
            <span 
                onClick={() => {
                    setPostcomments(!Postcomments);
                    if (!Postcomments) getAllPostComments(); 
                }} 
                className="flex gap-2 py-2 text-slate-400 w-full cursor-pointer"
            >
                View all comments
            </span>
            {Postcomments && (
                <div>
                    <div className='flex gap-2 pb-3'>
                        <input 
                            className="w-full outline-none rounded-md py-1 px-2 bg-slate-800"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a comment"
                        />
                        {text && (
                            <button onClick={postComment} className='text-blue-400 font-semibold'>
                                Post
                            </button>
                        )}
                    </div>

                    <div className="scroll w-full flex py-4 flex-col gap-2 h-80 overflow-y-auto hide-scrollbar">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={comment._id || index} className="flex flex-col">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex gap-2">
                                            {comment.author?.[0]?.avatar ? (
                                                <img 
                                                    src={comment.author[0].avatar}
                                                    className="h-8 w-8 object-cover bg-slate-600 rounded-full"
                                                    alt="Avatar"
                                                />
                                            ) : (
                                                <RxAvatar size={35} className="text-gray-500" />
                                            )}
                                            <div>
                                                <h1 className="font-bold">{comment.author?.[0]?.username || 'Unknown User'}</h1>
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No comments yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostComments;
