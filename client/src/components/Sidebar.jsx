import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
const Sidebar = () => {
  const [isEditUserDialog, setIsEditUserDialog] = useState(false);
  const user = useSelector((state) => state?.user);
  return (
    <div className="w-full h-full">
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

      {/* edit user details */}
      {isEditUserDialog && (
        <EditUserDetails
          onClose={() => setIsEditUserDialog(false)}
          user={user}
        />
      )}
    </div>
  );
};

export default Sidebar;
