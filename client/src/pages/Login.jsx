import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const { login } = useAuthStore();

  useEffect(() => {
    // GSAP animation for initial load
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
    });

    // Input focus animations
    const inputs = formRef.current.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("focus", () => {
        gsap.to(input.parentElement, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      input.addEventListener("blur", () => {
        gsap.to(input.parentElement, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Animate the SVG elements
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll("path");
      gsap.from(paths, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.4
      });
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidForm = () => {
    if (!formData.email.trim()) {
      toast.error("E-mail required");
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password required");
      return false;
    }
    if (formData.password.trim().length < 5) {
      toast.error("Password must be at least 5 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      setIsLoading(true);
      
      // Animation while submitting
      gsap.to(formRef.current, {
        opacity: 0.7,
        scale: 0.98,
        duration: 0.3,
      });
      
      try {
        await login(formData);
        
        // Success animation
        gsap.to(formRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        });
      } catch (error) {
        // Error animation
        gsap.to(formRef.current, {
          x: [0, 10, -10, 0],
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"
    >
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16">
        <motion.div 
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md space-y-6 bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700/50"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-gray-400 mt-2"
            >
              Sign in to continue your journey
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium text-gray-400">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-10 text-gray-200 bg-gray-800/50 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>

            <motion.div 
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium text-gray-400">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10 text-gray-200 bg-gray-800/50 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500 hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye size={20} className="text-gray-500 hover:text-gray-300 transition-colors" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
              className={`btn w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-indigo-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-4"
          >
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="link text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-auto text-indigo-400/50"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            <path d="M12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" opacity="0.3" />
            <path d="M12 18.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" opacity="0.3" />
          </svg>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold mt-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 relative z-10"
        >
          Welcome Back!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 mt-4 text-center max-w-md relative z-10"
        >
          Sign in to access your personalized dashboard and continue where you left off.
        </motion.p>
      </div>
    </div>
  );
};

export default Login;