import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { FaAngleLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";

const MessagePage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
    online: false,
  });
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message", userId);
      socketConnection.on("message-user", (userDetails) => {
        setUserData(userDetails);
      });
    }
  }, [socketConnection, userId, user]);

  return (
    <>
      <header className="bg-white sticky top-0 h-16 flex justify-between items-center p-4">
        <div className="flex gap-3 items-center h-full">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              imageUrl={userData.profileImage}
              height={60}
              width={60}
              userId={userId}
              name={userData.name}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData.name}
            </h3>
            <p className="font-normal text-sm text-gray-600">
              {userData?.online ? (
                <span className="text-green-600">Online</span>
              ) : (
                <span className="text-red-400">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="text-xl text-gray-600 cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* show all messages */}
      <section>show all messages</section>
    </>
  );
};

export default MessagePage;
