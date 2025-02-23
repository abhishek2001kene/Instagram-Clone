import React, { useState } from "react";
import axios from "axios";
import { showToast } from '../utils/toastUtils.js';

import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
    const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const response = await axios.post(
        "http://localhost:7000/api/v1/users/register",
        { username, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredential: true,
        }
      );

      console.log("Registration Successful:", response.data);
       showToast("Registration Successful:", "success");

      setUsername("");
      setPassword("");
      setEmail("");
      setTimeout(() => {
        navigate("/login");
    }, 1500);
    } catch (error) {
      showToast("Error during registration:" ,"error");
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
   
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="bg-slate-800 text-white w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="md:w-[30%] md:h-[80%]    w-[90%] h-[60%] bg-slate-900   flex flex-col justify-center gap-6 items-center rounded-md"
      >
        <h1 className="font-bold text-4xl">Instagram</h1>
        <p>Register to the social media</p>

        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md outline-none bg-slate-800 w-[70%]"
            type="text"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md outline-none bg-slate-800 w-[70%]"
            type="email"
          />
          <input
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="px-4 py-2 rounded-md outline-none bg-slate-800 w-[70%]"
            type="password"
          />

          <button
            type="submit"
            className="p-2 rounded-md bg-blue-600 font-bold w-[70%]"
          >
            
            {loading? "Registering User" : "Register"}
          </button>

          <p className="text-xs">
            Click here to
            <Link to="/login" className="text-blue-400 ml-1">
              Login
            </Link>
          </p>
        </div>
      </form>

    </div>
  );
}

export default Register;
