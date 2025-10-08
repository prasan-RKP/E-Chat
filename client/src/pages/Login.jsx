import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, Info } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js"; // Adjust the import path as necessary
//import {toast} from 'sonner';

// Mock implementations for the dependencies (same as old working code)
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

//Toast implementation from old working code
const toast = {
  error: (message) => {
    console.log('Error:', message);
    // Create a simple toast notification
    const toastEl = document.createElement('div');
    toastEl.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    setTimeout(() => document.body.removeChild(toastEl), 3000);
  }
};

// Assuming you have your own useAuthStore implementation

const Login = () => {
  // State management exactly from old working code
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const { login } = useAuthStore();

  // useEffect exactly from old working code
  useEffect(() => {
    // Simple fade-in animation for initial load
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'translateY(20px)';
      setTimeout(() => {
        containerRef.current.style.transition = 'all 0.8s ease-out';
        containerRef.current.style.opacity = '1';
        containerRef.current.style.transform = 'translateY(0)';
      }, 100);
    }

    // Image parallax effect
    if (imageRef.current) {
      const handleScroll = () => {
        const scrolled = window.pageYOffset;
        if (imageRef.current) {
          imageRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Input change handler exactly from old working code
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function exactly from old working code
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

  // Submit handler exactly from old working code
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      setIsLoading(true);

      // Animation while submitting
      if (formRef.current) {
        formRef.current.style.transition = 'all 0.3s ease';
        formRef.current.style.opacity = '0.7';
        formRef.current.style.transform = 'scale(0.98)';
      }

      try {
        await login(formData);

        // Success animation
        if (formRef.current) {
          formRef.current.style.opacity = '1';
          formRef.current.style.transform = 'scale(1)';
        }
      } catch (error) {
        // Error animation - shake effect
        if (formRef.current) {
          formRef.current.style.animation = 'shake 0.6s ease-in-out';
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.style.animation = '';
              formRef.current.style.opacity = '1';
              formRef.current.style.transform = 'scale(1)';
            }
          }, 600);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          border-color: #6366f1;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* Left Side - Catchy Image */}
      {/* from-purple-900 via-blue-900 to-indigo-900 */}
      <div className="lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-hidden bg-gradient-to-br bg-gray-300  flex lg:block">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-28 sm:w-40 lg:w-64 h-28 sm:h-40 lg:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-4 sm:-bottom-8 left-20 sm:left-40 w-36 sm:w-56 lg:w-80 h-36 sm:h-56 lg:h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div ref={imageRef} className="relative z-10 flex flex-col items-center justify-center w-full p-4 sm:p-8 lg:p-12 text-center">
          {/* Main Image Container */}
          <div className="mb-4 sm:mb-6 lg:mb-8 relative">
            <div className="w-[220px] h-[230px] sm:w-[24rem] sm:h-[23.5rem] md:w-[28rem] md:h-[27.5rem] lg:w-[32rem] lg:h-[31.5rem] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center relative">
                <img
                  src="/man.png"
                  alt="illus.."
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 sm:w-6 lg:w-7 h-4 sm:h-6 lg:h-7 bg-yellow-400 rounded-full opacity-80 float-animation"></div>
              <div
                className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 bg-blue-400 rounded-full opacity-80 float-animation"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 gradient-text">
            Welcome Back
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed px-4">
            Your digital workspace awaits. Sign in to continue your journey with us.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-16 bg-gray-300 min-h-[60vh] lg:min-h-screen">
        <div
          ref={containerRef}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            {/* <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-3 sm:mb-4 hover-lift">
              <Shield size={20} className="sm:hidden text-white" />
              <Shield size={24} className="hidden sm:block lg:hidden text-white" />
              <Shield size={32} className="hidden lg:block text-white" />
            </div> */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div ref={formRef} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl bg-white text-black input-glow focus:outline-none transition-all duration-300 hover-lift"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl bg-white text-black input-glow focus:outline-none transition-all duration-300 hover-lift"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col cursor-pointer sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
              <Link to={"/forgot-password"}>
                <button className=" text-purple-600 hover:text-purple-700 font-medium text-center sm:text-left">
                  Forgot Password?
                </button>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full hover:cursor-pointer py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center space-x-2 hover-lift ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="hover:cursor-pointer">Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span> */}
              </div>
            </div>

            {/* Social Login */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover-lift text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="ml-2 text-gray-700">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover-lift text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                <span className="ml-2 text-gray-700">Twitter</span>
              </button>
            </div> */}
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;