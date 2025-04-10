import React, { createContext, useContext, useState } from "react";

interface UserType {
  id?: number;
  name: string;
  email: string;
  image: string;
}

interface ContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

const getContext = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("getContext must be used within ContextProvider");
  }
  return context;
};

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export { ContextProvider, getContext };
