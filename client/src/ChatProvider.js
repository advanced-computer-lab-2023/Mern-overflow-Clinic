import React, { createContext, useContext, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { useUser } from "./userContest"

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const { userId, setUserId, userRole, setUserRole } = useUser();



  useEffect(() => {
    

    const userInfo = {userId:userId, userRole:userRole};
    setUser(userInfo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
