import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null,
  ); 
  const [userData, setUserData] = useState(
   (JSON.parse(localStorage.getItem("userData")))||null
  );

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }

    if (userRole) {
      localStorage.setItem("userRole",  userRole);
    } else {
      localStorage.removeItem("userRole");
    }

    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userId, userRole,userData]);

  return (
    <UserContext.Provider value={{ userId, setUserId, userRole, setUserRole, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
