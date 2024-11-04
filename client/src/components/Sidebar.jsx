import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { GoArrowUpLeft } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [isEditUserDialog, setIsEditUserDialog] = useState(false);
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      const userFromLocalStorage = JSON.parse(localStorage.getItem("userData"));
      socketConnection.emit(
        "sidebar",
        user?._id || userFromLocalStorage?._id || ""
      );
      socketConnection.on("conversation", (conversation) => {
        console.log(conversation);
        
        const userConversationData = conversation.map((userConversation) => {
          if (userConversation?.sender?._id === userConversation?.receiver?._id) {
            return {
              ...userConversation,
              userDetails: userConversation?.sender,
            };
          } else if (
            userConversation?.receiver?._id !== user?._id ||
            userFromLocalStorage?._id
          ) {
            return {
              ...userConversation,
              userDetails: userConversation?.sender,
            };
          } else {
            return {
              ...userConversation,
              userDetails: userConversation?.sender,
            };
          }
        });
        setAllUser(userConversationData);
      });
    }
  }, [socketConnection, user]);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-100 w-12 h-full py-5 rounded-tr-lg rounded-br-lg text-slate-700 flex flex-col justify-between">
        <div>
          <NavLink
            to="/"
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
            onClick={() => setOpenSearchUser(true)}
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
              width={40}
              height={40}
              color={"#334155"}
              name={user?.name}
              imageUrl={user?.profileImage}
              userId={user?._id}
            />
          </button>

          <button
            className="w-10 h-12 flex justify-center items-center hover:text-primary cursor-pointer"
            title="logout"
            onClick={() => {
              localStorage.removeItem("userData");
              dispatch({ type: "LOGOUT_USER" });
              navigate("/login");
            }}
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
          {allUser.length === 0 && (
            <div className="my-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={40} strokeWidth={1} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv, index) => (
            <NavLink
              to={`/${conv?.userDetails?._id}`}
              key={conv?._id}
              className="flex items-center gap-2 m-2 p-2 border rounded hover:bg-slate-100 hover:scale-105 hover:border-primary transition-all cursor-pointer"
            >
              <div>
                <Avatar
                  imageUrl={conv.userDetails?.profileImage}
                  name={conv.userDetails?.name}
                  height={40}
                  width={40}
                />
              </div>
              <div>
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-gray-800 text-base">
                  {conv.userDetails?.name || "Unknown User"}
                </h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <div>
                    {conv?.lastMessage?.imageUrl && (
                      <div className="flex gap-1 items-center">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMessage?.text && <span>Image</span>}
                      </div>
                    )}
                    {conv?.lastMessage?.videoUrl && (
                      <div className="flex gap-1 items-center">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMessage?.text && <span>Video</span>}
                      </div>
                    )}
                  </div>
                  <p className="text-ellipsis overflow-hidden line-clamp-1 w-full">
                    {conv?.lastMessage?.text || "No message available"}
                  </p>
                </div>
              </div>
              <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto bg-primary text-white rounded-full font-semibold">
                <span>
                  {conv?.unseenMessages > 9 ? "9+" : conv?.unseenMessages || 0}
                </span>
              </p>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Edit user details */}
      {isEditUserDialog && (
        <EditUserDetails
          onClose={() => setIsEditUserDialog(false)}
          user={user}
        />
      )}

      {/* Search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
