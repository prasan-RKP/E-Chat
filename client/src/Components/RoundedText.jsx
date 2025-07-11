import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";

const RoundedText = () => {
  const { getUsers, users, setIsSidebarOpen, isSidebarOpen } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  console.log('isSidebarOpen value', isSidebarOpen);

  return (
    <div>
      <h2 className="text-red-400">helllo guys </h2>
      <button className="btn btn-accent" onClick={()=> setIsSidebarOpen(true)}>Accent</button>
      <button className="btn btn-warning" onClick={()=> setIsSidebarOpen(false)}>Warning</button>
    </div>
  );
};

export default RoundedText;
