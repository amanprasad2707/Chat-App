import axios from "axios";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/chatterbee-logo.svg";

const Home = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    // console.log("Fetching user details...");
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/check-auth`;
      const response = await axios.get(URL, {
        withCredentials: true,
      });

      // console.log(response.data);
      dispatch(setUser(response.data.user));
      // console.log("redux", user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const user = useSelector((state) => state.user);
  const basePath = location.pathname === "/";
  useEffect(() => {
    fetchUserDetails();
  }, [dispatch]);

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block `}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div className={`justify-center items-center flex-col gap-4 hidden ${basePath && "lg:flex" }`}>
        <div>
          <img src={logo} alt={logo} width="400px" />
        </div>
        <p className="mt-1 text-lg text-slate-500">select user to send message</p>
      </div>
    </div>
  );
};

export default Home;
