import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/chatterbee-logo.svg";
import io from "socket.io-client";

const Home = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // Fetch user details function
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/check-auth`;
      const response = await axios.get(URL, {
        withCredentials: true,
      });

      // Dispatch user details to Redux store
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const basePath = location.pathname === "/";
  
  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);


  useEffect(()=>{
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL,{
      auth : {
        user : JSON.parse(localStorage.getItem("userData"))
      },
    })

    socketConnection.on('onlineUser',(onlineUser)=>{
      console.log(onlineUser)
      dispatch(setOnlineUser(onlineUser))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])



  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
      <Outlet  />
      </section>
      <div
        className={`justify-center items-center flex-col gap-4 hidden ${
          basePath && "lg:flex"
        }`}
      >
        <div>
          <img src={logo} alt="Chatterbee Logo" width="400px" />
        </div>
        <p className="mt-1 text-lg text-slate-500">
          Select user to send a message
        </p>
      </div>
    </div>
  );
};

export default Home;
