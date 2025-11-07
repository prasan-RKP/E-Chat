import React, { useEffect, useState } from "react";

const RenderWakeLoader = () => {
  const messages = [
    { text: "Allocating cloud resources", icon: "☁️" },
    { text: "Booting up servers", icon: "⚙️" },
    { text: "Connecting to database", icon: "💾" },
    { text: "Warming up services", icon: "🔥" },
    { text: "Almost ready...", icon: "🚀" },
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 125);
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-purple-500/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Radial gradient spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-2xl">
        {/* Premium glass card */}
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-10 md:p-14 rounded-3xl sm:rounded-[2rem] border border-white/10 shadow-[0_8px_32px_0_rgba(139,92,246,0.2)] w-full">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 animate-border-glow"></div>
          
          {/* Luxury spinner container */}
          <div className="relative mb-8 sm:mb-10 flex justify-center">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-purple-500/20 rounded-full animate-spin-slow"></div>
            </div>
            {/* Middle rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-2 border-t-purple-400 border-r-pink-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            {/* Inner glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full filter blur-2xl opacity-60 animate-pulse-slow"></div>
            </div>
            {/* Center infinity loader */}
            <span className="loading loading-infinity loading-md sm:loading-lg text-white relative z-10 scale-150 sm:scale-[2]"></span>
          </div>

          {/* Message section */}
          <div className="text-center space-y-4 sm:space-y-6 w-full">
            {/* Icon and text */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 min-h-[50px]">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50"></div>
                <span className="relative text-4xl sm:text-5xl animate-bounce-slow filter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  {messages[messageIndex].icon}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent tracking-tight px-2">
                {messages[messageIndex].text}
              </h2>
            </div>

            {/* Elegant progress bar */}
            <div className="space-y-3">
              <div className="relative w-full max-w-md mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-purple-300/80 font-medium">{progress}% Complete</span>
                <span className="text-white/40 font-light">Step {messageIndex + 1}/{messages.length}</span>
              </div>
            </div>

            {/* Premium subtext */}
            <p className="text-white/60 text-base sm:text-lg font-light tracking-wide px-2">
              Crafting your premium experience
              <span className="inline-block animate-pulse-slow ml-1">✨</span>
            </p>
          </div>

          {/* Status dots with glow */}
          <div className="flex gap-2 sm:gap-3 mt-8 sm:mt-10 justify-center">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-700 ${
                  index === messageIndex
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 w-10 sm:w-12 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                    : index < messageIndex
                    ? "bg-purple-500/40 w-2 sm:w-2.5"
                    : "bg-white/10 w-2 sm:w-2.5"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating stats */}
        <div className="flex gap-4 sm:gap-8 mt-8 sm:mt-12 text-center">
          <div className="backdrop-blur-xl bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-bold text-white">{messageIndex + 1}/{messages.length}</p>
            <p className="text-xs text-white/50 mt-1">Progress</p>
          </div>
          <div className="backdrop-blur-xl bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{progress}%</p>
            <p className="text-xs text-white/50 mt-1">Loading</p>
          </div>
        </div>
      </div>

      {/* Ultra-premium brand footer */}
      <div className="absolute bottom-6 sm:bottom-10 text-center px-4">
        <div className="backdrop-blur-xl bg-white/5 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10">
          <p className="text-white/50 text-xs sm:text-sm font-light tracking-wider">
            POWERED BY
          </p>
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mt-1 tracking-tight">
            Prasan RKP
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes border-glow {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RenderWakeLoader;