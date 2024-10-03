import React, { useState } from "react";
import uploadArea from "../assets/upload_area.png";
import { Lock, Mail, User, X } from "lucide-react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import uploadFile from "../lib/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
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

  const handleClearUploadedImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setImage(null);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    const uploadImage = await uploadFile(file);
    setData((prev) => {
      return {
        ...prev,
        profileImage: uploadImage?.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/signup`;
    try {
      const response = await axios.post(URL, data,{
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          profileImage: "",
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
          <label htmlFor="name">Name</label>
          <Input
            icon={User}
            onChange={handleOnChange}
            type="text"
            id="name"
            name="name"
            value={data.name}
            placeholder="Enter your Name"
            required
          />
        </div>

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

        <div className="flex gap-4 cursor-pointer bg-slate-100 rounded overflow-hidden">
          <label htmlFor="image" className="cursor-pointer">
            <div className="flex justify-center items-center gap-4 h-[100px]">
              <img
                src={image ? URL.createObjectURL(image) : uploadArea}
                alt="upload your image here"
                width="100px"
                height="100px"
              />
              <div className="flex justify-center items-center text-sm">
                <p>{image ? image.name : "upload your profile image "}</p>
                {image && (
                  <button
                    onClick={handleClearUploadedImage}
                    className="relative top-0 left-3 hover:text-primary"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </label>
          <input
            className="bg-slate-100 outline-none border-2 focus:border-primary rounded w-full p-1"
            type="file"
            id="image"
            name="image"
            accept="image/png, image/gif, image/jpeg"
            hidden
            onChange={handleUploadImage}
          />
        </div>

        <button
          className="bg-primary text-white p-2 rounded"
          type="submit"
          onSubmit={handleSubmit}
        >
          Signup
        </button>
      </form>
      <p className="mt-2 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary hover:underline font-semibold"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
