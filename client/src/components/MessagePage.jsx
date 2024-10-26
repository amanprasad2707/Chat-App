import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import uploadFile from "../lib/uploadFile";
import Avatar from "./Avatar";
import { FaAngleLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import backgroundImage from "../assets/backgroundImage.png";
import Loading from "./CircularLoading";
const MessagePage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [uploadMenu, setUploadMenu] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    seen: false,
  });

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

  const handleUploadImage = async (e) => {
    const uploadImage = e.target.files[0];
    setLoading(true);
    const imageFile = await uploadFile(uploadImage);
    setLoading(false);
    setMessage((prev) => ({ ...prev, imageUrl: imageFile.url }));
    setUploadMenu(false);
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };
  const handleUploadVideo = async (e) => {
    const uploadImage = e.target.files[0];
    setLoading(true);
    const videoFile = await uploadFile(uploadImage);
    setLoading(false);
    setMessage((prev) => ({ ...prev, videoUrl: videoFile.url }));
    setUploadMenu(false);
  };
  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handleMessageText = (e)=>{
    setMessage((prev) => ({ ...prev, text: e.target.value}))
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    
  }

  return (
    <div>
      <header className="bg-white sticky top-0 h-16 flex justify-between items-center p-4">
        <div className="flex gap-3 items-center h-full">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              imageUrl={userData.profileImage}
              height={50}
              width={50}
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
          <button className="text-xl text-gray-600 cursor-pointer hover:text-primary" title="Attach files">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* show all messages */}
      <section
        className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-slate-300 bg-opacity-40"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* display uploaded image */}
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-900 bg-opacity-40 flex justify-center items-center overflow-hidden relative">
            <div
              onClick={handleClearUploadImage}
              className="absolute top-2 right-2 hover:text-red-600 hover:rotate-180 transition-all ease-linear delay-150 cursor-pointer"
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 rounded max-w-[400px] max-h-[400px]">
                <img
                  src={message.imageUrl}
                  className="aspect-auto w-full h-full object-contain rounded"
                  alt="upload Image"
                />
              
            </div>
          </div>
        )}
        {/* display uploaded video */}
        {message.videoUrl && (
          <div className="w-full h-full bg-slate-900 bg-opacity-40 flex justify-center items-center overflow-hidden relative">
            <div
              onClick={handleClearUploadVideo}
              className="absolute top-2 right-2 hover:text-red-600 hover:rotate-180 transition-all ease-linear delay-150 cursor-pointer"
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 rounded max-w-[400px] max-h-[400px]">
                <video src={message.videoUrl} controls muted></video>
              
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center w-full h-full bg-slate-900 bg-opacity-20">
            <Loading/>
          </div>
        )}
        show all messages
      </section>

      {/* send message */}
      <section className="h-16 bg-white flex items-center">
        <div className="flex items-center h-full px-4 relative">
          <button
            className={`w-8 h-8 text-slate-500 hover:bg-primary rounded-full flex items-center justify-center hover:text-white transition-all delay-0 ${
              uploadMenu && "rotate-[135deg] bg-primary text-white"
            } transition-all`}
            onClick={() => setUploadMenu(!uploadMenu)}
          >
            <FaPlus />
          </button>

          {/* image and video popup */}
          {uploadMenu && (
            <div className="bg-white shadow rounded absolute bottom-16 w-28 p-2 -ml-2 mb-1">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 p-2 hover:bg-slate-200 transition cursor-pointer"
                >
                  <div className="text-blue-600">
                    <FaImage />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 p-2 hover:bg-slate-200 transition cursor-pointer"
                >
                  <div className="text-purple-600">
                    <FaVideo />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  onChange={handleUploadImage}
                  id="uploadImage"
                  hidden
                  accept="image/*"
                />
                <input
                  type="file"
                  onChange={handleUploadVideo}
                  id="uploadVideo"
                  hidden
                  accept="video/*"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form className="w-full h-full flex " onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={message.text}
            onChange={handleMessageText}
            className="w-full h-full py1 px-4 text-lg outline-none focus:bg-slate-100"
          />
          <button type="submit" className="p-4 text-slate-500 hover:text-primary transition hover:scale-90 text-2xl mr-4 overflow-hidden">
            <IoSend />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
