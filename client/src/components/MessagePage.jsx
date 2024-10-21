import React, { useState } from "react";
import { useParams } from "react-router-dom";

const MessagePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  return <div>{userId}</div>;
};

export default MessagePage;
