import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { GoArrowUpLeft } from "react-icons/go";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import SearchUser from "./SearchUser";
const Sidebar = () => {
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [isEditUserDialog, setIsEditUserDialog] = useState(false);
  const user = useSelector((state) => state?.user);
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-100 w-12 h-full py-5 rounded-tr-lg rounded-br-lg text-slate-700 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center hover:text-primary cursor-pointer ${
                isActive && "bg-slate-300"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipsesSharp size={25} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center hover:text-primary cursor-pointer"
            title="Add user"
            onClick={()=>setOpenSearchUser(true)}
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <button
            className="mx-auto block"
            title={user?.name}
            onClick={() => setIsEditUserDialog(true)}
          >
            <Avatar
              width={30}
              color={"#334155"}
              name={user?.name}
              imageUrl={user.profileImage}
            />
          </button>

          <button
            className="w-10 h-12 flex justify-center items-center hover:text-primary cursor-pointer"
            title="logout"
          >
            <BiLogOut size={30} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="font-bold p-4 text-xl text-slate-800">Message</h2>
        </div>
        <Divider />
        <div className="h-[calc(100vh-73px)] overflow-x-hidden overflow-y-auto scrollbar">
          {
            allUser.length == 0 && (
              <div className="my-12">
                <div className="flex justify-center items-center my-4 text-slate-500">
                  <GoArrowUpLeft size={40} strokeWidth={1}/>
                </div>
                <p className="text-lg text-center text-slate-400">Explore users to start a conversation with.</p>
              </div>


            )
          }
        </div>
      </div>

      {/* edit user details */}
      {isEditUserDialog && (
        <EditUserDetails
          onClose={() => setIsEditUserDialog(false)}
          user={user}
        />
      )}

      {/* search user */}

      {
        openSearchUser && (
          <SearchUser onClose={()=> setOpenSearchUser(false)}/>
        )
      }

    </div>
  );
};

export default Sidebar;
