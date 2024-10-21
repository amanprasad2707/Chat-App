import React from "react";
import Avatar from "./Avatar";
import {Link} from 'react-router-dom'


const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link to={`/${user?._id}`} onClick={onClose} className="flex gap-8 my-4 border p-2 border-gray-300 rounded-md hover:bg-slate-200 cursor-pointer transition-all">
      <div>
        <Avatar
          name={user.name}
          imageUrl={user.profileImage}
          width={50}
          height={50}
        />
      </div>
      <div>
        <h4 className="font-semibold text-md">{user?.name}</h4>
        <p className="text-sm text-wrap">{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
