import React, { useState } from "react";
import { BiWorld } from "react-icons/bi";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // To track the state of the hamburger menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
  };

  return (
    <header className="bg-white text-gray-800 shadow-md py-4 px-6 sm:px-10 mb-1">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4">
        {/* Header Logo Section */}
        <Link to="/">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left flex items-center gap-2">
            <BiWorld className="text-3xl" />
            Explorer
          </h1>
        </Link>
        {/* Hamburger and Menu Section */}
        <nav className="relative">
          {/* Hamburger Icon for small screens */}
          <div className="sm:hidden" onClick={toggleMenu}>
            <RxHamburgerMenu className="text-3xl cursor-pointer" />
          </div>

          {/* Full-Width Menu for small screens */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } fixed inset-0 bg-white z-50 sm:static sm:flex sm:flex-row gap-4 sm:gap-6 items-center py-4 sm:py-0`}
          >
            <ul className="flex flex-col sm:flex-row gap-8 sm:gap-4 items-center justify-center w-full h-full">
              <li>
                <Link
                  to="/login"
                  className="text-black-500 hover:text-black-600 "
                >
                  LOGIN
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-black-500 hover:text-black-600"
                >
                  SIGN UP
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-black-500 hover:text-black-600"
                >
                  ABOUT PAGE
                </Link>
              </li>
             
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
