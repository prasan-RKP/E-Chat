import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import AddPost from "./pages/AddPost";
import Posts from "./pages/Posts";
import ChatComponent from "./pages/ChatComponent";
import NotificationPage from "./pages/NotificationPage";
import ChartSession from "./pages/ChartSession";
import VisitUser from "./pages/VisitUser";
import PostCarousel from "./assets/PostCarousel";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

import { Loader } from "lucide-react";
import RenderWakeLoader from "./tests/RenderWakeLoader";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isBackendReady, setIsBackendReady] = useState(false);

  // 🧠 Check if backend (Render) is ready
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // ⚙️ Replace with your actual Render backend URL
        const res = await fetch("https://chat-io-bjln.onrender.com/ping");
        if (res.ok) {
          setIsBackendReady(true);
        } else {
          throw new Error("Backend not ready yet");
        }
      } catch (err) {
        console.log("Render backend waking up...");
        setTimeout(checkBackend, 3000); // retry every 3 seconds
      }
    };
    checkBackend();
  }, []);

  // ✅ Once backend is awake, check auth
  useEffect(() => {
    if (isBackendReady) {
      checkAuth();
    }
  }, [isBackendReady, checkAuth]);

  // 🌀 Loader when Render backend is waking up
  if (!isBackendReady) {
    return <RenderWakeLoader />;
  }

  // 🔐 Loader during authentication check
  if (isCheckingAuth && !authUser) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-700">
        <Loader className="animate-spin" color="white" size={84} />

        <p className="mt-6 text-lg text-white tracking-widest animate-typing overflow-hidden border-r-4 border-white whitespace-nowrap">
          Loading... Please wait
        </p>
      </div>;
  }

  // ✅ Main App routes after backend & auth are ready
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route
          path="/pref-chart"
          element={authUser ? <ChartSession /> : <Navigate to="/login" replace />}
        />

        {/* Forgot / Reset Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/profile" replace />}
        />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatComponent /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/addpost"
          element={authUser ? <AddPost /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/allposts"
          element={authUser ? <Posts /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/visit-user/:id"
          element={authUser ? <VisitUser /> : <Navigate to="/login" replace />}
        />

        {/* Extra */}
        <Route path="/adj" element={<PostCarousel />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default App;
