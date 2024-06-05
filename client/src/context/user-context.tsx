"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { CurrentUser } from "@/types/currentUser";

interface UserContextType {
  currentUser: CurrentUser["currentUser"];
  setCurrentUser: (user: CurrentUser["currentUser"]) => void;
}

const defaultContextValue: UserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider: React.FC<{
  children: ReactNode;
  initialUser: CurrentUser["currentUser"];
}> = ({ children, initialUser }) => {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser["currentUser"]>(initialUser);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
