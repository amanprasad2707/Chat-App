import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../lib/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profileImage: user?.profileImage,
  });

  const dispatch = useDispatch();

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
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
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-profile`;
    try {
      const response = await axios.post(URL, data, { withCredentials: true });
      if (response.data.success) {
        toast.success(
          response?.data?.message || "Profile updated successfully"
        );
        onClose()
        try {
          dispatch(setUser(data));
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message || "unable to update profile");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setData((prev) => ({ ...prev, ...data }));
  }, [user]);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-45 backdrop-blur-sm flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 rounded-md w-full max-w-sm">
        <h2 className="font-semibold">Profile details</h2>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border"
            />
          </div>

          <div>
            <p>Profile Image:</p>
            <div className="my-2 flex items-center gap-4">
              <Avatar
                height={60}
                width={60}
                imageUrl={data.profileImage}
                name={data.name}
              />
              <label htmlFor="changeImage">Change Image</label>
              <input
                type="file"
                className="hidden"
                id="changeImage"
                onChange={handleUploadImage}
              />
            </div>
          </div>
          <Divider />
          <div className="flex gap-4 ml-auto mt-2">
            <button
              onClick={onClose}
              className="border-primary border px-4 py-1 rounded-md hover:bg-primary hover:text-white transition-all duration-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-primary border px-4 py-1 rounded-md bg-primary hover:bg-[#123811] text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
