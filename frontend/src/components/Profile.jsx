import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiUser, FiStar, FiTrendingUp, FiAward } from "react-icons/fi";
import { useSession } from "../contexts/SessionContext";

const Profile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userDetails, handleLogout } = useSession();

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {userDetails ? (
        <>
          {/* Profile Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
              {userDetails.firstName.charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 transition-all animate-fade-in">
              <div className="px-5 py-4 border-b border-gray-200">
                <p className="text-base font-semibold text-gray-800">
                  👋 Hello, {userDetails.firstName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {userDetails.email}
                </p>
              </div>

              <div className="px-5 py-3 space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FiUser className="text-indigo-500" />
                  <span>First Name: {userDetails.firstName}</span>
                </div>

                <Link
                  to="/fav"
                  className="flex items-center gap-2 hover:text-green-600 transition"
                >
                  <FiStar className="text-yellow-500" />
                  <span>My Favourite Country</span>
                </Link>
                <Link
                  to="/trending"
                  className="flex items-center gap-2 hover:text-green-600 transition"
                >
                  <FiTrendingUp className="text-green-500" />
                  <span>Trending Countries</span>
                </Link>
                <Link
                  to="/game"
                  className="flex items-center gap-2 hover:text-green-600 transition"
                >
                  <FiAward className="text-purple-500" />
                  <span>Play Country Game</span>
                </Link>
              </div>

              <div className="border-t px-5 py-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-red-600 hover:text-red-800 font-medium hover:bg-red-100 rounded-lg px-2 py-2 transition-all"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-sm animate-pulse">
          Loading profile...
        </div>
      )}
    </div>
  );
};

export default Profile;
