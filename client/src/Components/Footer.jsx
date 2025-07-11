import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-300 text-gray-900 mt-12 p-6 text-center rounded-lg shadow-md">
        <div className="flex flex-wrap justify-center space-x-6 mb-4">
          <a
            href="#"
            className="relative transition duration-300 hover:text-blue-950 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-950 after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>
          <a
            href="#"
            className="relative transition duration-300 hover:text-blue-950 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-950 after:transition-all after:duration-300 hover:after:w-full"
          >
            Privacy
          </a>
          <a
            href="#"
            className="relative transition duration-300 hover:text-blue-950 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-950 after:transition-all after:duration-300 hover:after:w-full"
          >
            Terms
          </a>
          <Link
            to="/fetchroute"
            className="relative transition duration-300 hover:text-blue-950 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-950 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>
        </div>

        <div className="flex justify-center space-x-4 text-violet-500">
          <a href="#" className="hover:text-gray-700">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-gray-700">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-gray-700">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-gray-700">
            <Linkedin size={20} />
          </a>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          © {new Date().getFullYear()} Your Website. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
