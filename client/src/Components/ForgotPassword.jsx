import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState } from "react";
import { Lock } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from "../lib/axiosInstance.js";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/forgot-password", { email });

            // Extract token from the reset link or response
            const resetLink = res?.data?.resetLink;
            if (resetLink) {
                // Extract token from the reset link
                const token = resetLink.split('/').pop();

                toast.success("Password reset link generated! Redirecting...");

                // For testing: Navigate directly (in production, user would click email link)
                setTimeout(() => {
                    navigate(`/reset-password/${token}`);
                }, 1100);
            } else if (res?.data?.token) {
                toast.success("Password reset link generated! Redirecting...");
                setTimeout(() => {
                    navigate(`/reset-password/${res?.data?.token}`);
                }, 1100);
            } else {
                toast.error("Reset token not received");
            }

        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left side - Image Carousel */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Content Container */}
                <div className="relative z-20 flex flex-col items-center justify-center px-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Swiper
                            modules={[Autoplay, EffectFade]}
                            effect="fade"
                            loop
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            className="w-full"
                        >
                            <SwiperSlide>
                                <motion.img
                                    src="/forgot.png"
                                    alt="Reset Password"
                                    className="object-contain w-96 h-96 mx-auto drop-shadow-2xl"
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 2, 0, -2, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </SwiperSlide>
                        </Swiper>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-center mt-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Forgot Your Password?
                        </h1>
                        <p className="text-white/90 text-lg max-w-md leading-relaxed">
                            Don't worry! Enter your registered email address, and we'll send you a link to reset your password securely.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Forgot Password Form */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12"
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password!</h2>
                        <p className="text-gray-600">Enter your E-mail Below..</p>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full text-black px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}