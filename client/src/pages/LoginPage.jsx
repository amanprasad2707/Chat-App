import React, { useState } from "react";
import Input from "../components/Input";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/login`;
    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
        // Convert user data to a JSON string and store it in localStorage
        
localStorage.setItem("userData", JSON.stringify(response.data.userData));
dispatch(setUser(response.data.userData));
console.log(response.data.userData);
        setData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-white w-[90%] max-w-md  rounded overflow-hidden p-4 mx-auto border  mt-10">
      <h3 className="text-primary text-center font-semibold text-2xl mt-5">
        Create Account
      </h3>
      <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <Input
            icon={Mail}
            onChange={handleOnChange}
            type="email"
            id="email"
            name="email"
            value={data.email}
            placeholder="Enter your Email Address"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <Input
            icon={Lock}
            onChange={handleOnChange}
            type="password"
            id="password"
            name="password"
            value={data.password}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          className="bg-primary text-white p-2 rounded"
          type="submit"
          onSubmit={handleSubmit}
        >
          Login
        </button>
      </form>
      <p className="mt-2 text-center">
        Didn't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary hover:underline font-semibold"
        >
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
