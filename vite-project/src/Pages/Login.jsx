import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../Redux/authSlice";
import { showToast } from '../utils/toastUtils.js';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:7000/api/v1/users/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },  
                    withCredentials: true 
                }
            );
            
            dispatch(setAuthUser(response.data.data.user));
            setTimeout(() => {
                navigate("/home");
            }, 1500);
            console.log(response.data.data.user.username);
            showToast(`Welcome Back ${response.data.data.user.username}`, "success");

        } catch (error) {
            console.log(error);
            showToast("Error while login", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 text-white w-full h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="w-[90%] h-[60%] md:w-[30%] md:h-[80%] bg-slate-900 flex flex-col justify-center gap-6 items-center rounded-md p-6"
            >
                <h1 className="font-bold text-4xl">Instagram</h1>
                <p>Login to the social media</p>

                <div className="flex flex-col justify-center items-center gap-4 w-full">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-md outline-none bg-slate-800 w-[70%]"
                        type="email"
                        required
                    />
                    <input
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="px-4 py-2 rounded-md outline-none bg-slate-800 w-[70%]"
                        type="password"
                        required
                    />

                    <button
                        type="submit"
                        className="p-2 rounded-md bg-blue-600 font-normal w-[70%] disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-xs">
                        Don't have an account? 
                        <Link to="/register" className="text-blue-400 ml-1">Register here</Link>
                    </p>
                </div>
            </form>

   
         
        </div>
    );
}

export default Login;
