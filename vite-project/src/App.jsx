import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import EditProfile from "./Components/EditProfile";
import ChatPage from "./Components/ChatPage";
import ProtectedRoutes from "./Components/ProtectedRoutes";


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
      { path: "/home", element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: "/profile/:id", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: "/account/edit", element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
      

    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
 

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
