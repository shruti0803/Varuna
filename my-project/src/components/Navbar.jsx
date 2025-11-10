import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ activeTab, setActiveTab }) => {
  const TABS = ["Routes", "Compare", "Banking", "Pooling"];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Varuna
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 font-medium text-sm transition duration-300 rounded-lg ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Login button */}
        <div className="hidden md:block">
          <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Tabs Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition font-medium ${
                activeTab === tab ? "bg-blue-100" : ""
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="px-6 py-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
