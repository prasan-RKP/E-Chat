import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import ProfilePage from "./pages/ProfilePage";
import { Loader } from "lucide-react";
import AddPost from "./pages/AddPost";
import Posts from "./pages/Posts";
import ProfileAdj from "./Components/ProfileAdj";
import GifLoader from "./Components/GifLoader";
import ChatComponent from "./pages/ChatComponent";
// import ChatContainer from "./pages/ChatContainer";
import ChatSidebar from "./Components/chats/ChatSidebar";
import RoundedText from "./Components/RoundedText";
import MessagesSkeleton from "./skeletons/MessagesSkeleton";
import ChatAppLanding from "./UI/ChatAppLanding";
import ChatAppLogin from "./UI/ChatAppLogin";
import LoginTrae from "./UI/LoginTrae";
import Toggle from "./tests/Toggle";
import Email from "./Jsons/Email";
import Testing from "./pages/Testing";
import OldPost from "./TempStore/OldPost";
import NotificationPage from "./pages/NotificationPage";
import ChartSession from "./pages/ChartSession";
import ChartSkeleton from "./skeletons/ChartSkeleton";
//import NewLogin from "./pages/NewLogin";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // We will renove this thing, TODO:- we have add like if someone goes to the other tabs and aftr ome time if he/she comes back then we will loggout the user
/*
useEffect(() => {
  let isNavigating = false;
  
  const handleBeforeUnload = () => {
    isNavigating = true;
    // Check if it's a reload
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload" || 
                    performance.navigation?.type === 1;
    
    if (!isReload) {
      const data = JSON.stringify({ reason: "tab_closed" });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("http://localhost:5008/auth/logout", blob);
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);
*/



  if (isCheckingAuth && !authUser)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-700">
        <Loader className="animate-spin" color="white" size={84} />

        <p className="mt-6 text-lg text-white tracking-widest animate-typing overflow-hidden border-r-4 border-white whitespace-nowrap">
          Loading... Please wait
        </p>
      </div>

      // <GifLoader />
    );

  return (
    <div>
      <Routes>
        <Route path="/testing" element={<OldPost />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/adj" element={<NewLogin />} /> */}
        <Route path="/pref-chart" element={authUser ? <ChartSession /> : <Navigate to={"/login"} replace />} />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/profile"} replace />}
        />
        <Route
          path="/signup"
          element={
            !authUser ? <SignUp /> : <Navigate to={"/profile"} replace />
          }
        />
        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to={"/login"} replace />
          }
        />

        <Route
          path="/chat"
          element={
            authUser ? <ChatComponent /> : <Navigate to={"/login"} replace />
          }
        />

        <Route
          path="/addpost"
          element={authUser ? <AddPost /> : <Navigate to={"/login"} replace />}
        />

        <Route
          path="/allposts"
          element={authUser ? <Posts /> : <Navigate to={"/login"} replace />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
