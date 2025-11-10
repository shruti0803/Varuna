// Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Varuna
          </h2>
          <p className="text-sm leading-relaxed">
            Varuna connects people through trust, efficiency, and care — simplifying your daily tasks with seamless service solutions.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Services</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-white transition hover:scale-110 transform"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition hover:scale-110 transform"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition hover:scale-110 transform"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition hover:scale-110 transform"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Varuna. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
