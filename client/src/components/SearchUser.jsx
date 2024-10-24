import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import CircularLoading from "./CircularLoading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [SearchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        searchUser: search,
      });
      setSearchUser(response.data.users);
      // console.log(response);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 min-h-screen bg-gray-700 bg-opacity-45 backdrop-blur-sm p-3 z-10">
      <div className="w-full max-w-md mx-auto mt-10">
        <div className="bg-white rounded-md flex justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search user by name or email"
            className="w-full h-full py-3 px-2 rounded-md outline-none text-lg text-slate-600 placeholder:text-lg"
          />
          <div className="flex justify-center items-center text-slate-600 p-2">
            <RiSearchLine size={25} onClick={handleSearchUser} />
          </div>
        </div>

        {/* display search users */}

        <div className="bg-white mt-2 w-full p-4 rounded-md">
          {/* no user found */}
          {SearchUser?.length == 0 && !loading && (
            <p className="text-center text-slate-500">user not found!</p>
          )}

          {loading && (
            <div className="flex justify-center">
              <CircularLoading />
            </div>
          )}

          <div className="">
            {SearchUser.length != 0 &&
              !loading &&
              SearchUser.map((user, index) => (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              ))}
          </div>
        </div>
        <button className="absolute top-0 right-0 text-4xl p-2 hover:text-primary" onClick={onClose}>
        <IoCloseCircleOutline/>
      </button>
      </div>
    </div>
  );
};

export default SearchUser;
