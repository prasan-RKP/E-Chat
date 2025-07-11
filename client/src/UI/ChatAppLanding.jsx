import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  Globe,
  Shield,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

const ChatAppLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-white text-primary" />,
      title: "Real-time Messaging",
      description:
        "Send and receive messages instantly with our lightning-fast chat system.",
    },
    {
      icon: <Users className="w-6 h-6 text-white text-primary" />,
      title: "Group Chats",
      description:
        "Create and manage multiple group conversations with friends, family, or colleagues.",
    },
    {
      icon: <Globe className="w-6 h-6 text-white text-primary" />,
      title: "Global Reach",
      description:
        "Connect with people from all around the world with automatic translation.",
    },
    {
      icon: <Shield className="w-6 h-6 text-white text-primary" />,
      title: "End-to-End Encryption",
      description:
        "Your conversations are secure with our advanced encryption technology.",
    },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                ChatFlow
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                Testimonials
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <a href="#signup" className="btn btn-primary">
                Get Started
              </a>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 px-2"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                >
                  Testimonials
                </a>
                <a href="#signup" className="px-4 py-2 btn btn-primary">
                  Get Started
                </a>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                Connect with <span className="text-primary">Anyone</span>,
                Anywhere
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Experience the next generation of messaging with ChatFlow.
                Secure, fast, and intuitive communication for individuals and
                teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#signup" className="btn btn-primary btn-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#demo"
                  className="btn btn-outline btn-lg dark:border-gray-600 dark:text-gray-300"
                >
                  View Demo
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-primary p-4 flex items-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                    <span className="ml-2 text-white font-medium">
                      ChatFlow
                    </span>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start">
                        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-3 max-w-xs">
                          <p className="text-gray-800 dark:text-gray-200">
                            Hey there! How's it going?
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            10:24 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end">
                        <div className="bg-primary rounded-lg p-3 max-w-xs">
                          <p className="text-white">
                            I'm doing great! Just checking out this new chat
                            app.
                          </p>
                          <p className="text-xs text-primary-content mt-1">
                            10:26 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-3 max-w-xs">
                          <p className="text-gray-800 dark:text-gray-200">
                            It looks amazing! The interface is so clean.
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            10:28 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end">
                        <div className="bg-primary rounded-lg p-3 max-w-xs">
                          <p className="text-white">
                            I know! And it's so fast too. No lag at all.
                          </p>
                          <p className="text-xs text-primary-content mt-1">
                            10:30 AM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t dark:border-gray-600">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="input input-bordered flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                      />
                      <button className="btn btn-primary ml-2">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover what makes ChatFlow the best messaging platform for
                your communication needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-2/3 mb-8 lg:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to transform how you communicate?
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  Join thousands of users who have already switched to ChatFlow
                  for their messaging needs.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Secure and private messaging</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Unlimited group chats</span>
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    <span>Available on all your devices</span>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto lg:mx-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Get Started Now
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Create Free Account
                    </button>
                  </form>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    By signing up, you agree to our Terms and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    ChatFlow
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Modern messaging for teams and individuals. Connect anywhere,
                  anytime with our secure platform.
                </p>
                <div className="flex space-x-4">
                  ...
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  ...
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Product
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Security
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Enterprise
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Partners
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                  © 2025 ChatFlow. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatAppLanding;
