import React from "react";
import { BiWorld } from "react-icons/bi";
import Profile from "./Profile";
import {Link} from "react-router-dom"

function UserHeader() {
  return (
    <header className="bg-white text-gray-800 shadow-md p-4 flex justify-between items-center mb-1">
      <Link to="/profile">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left flex items-center gap-2">
            <BiWorld className="text-3xl" />
            Explorer
          </h1>
        </Link>
      <nav>
        <div className="flex gap-2.5 flex-row">   
          <Profile/>
        </div>
      </nav>
    </header>
  );
}

export default UserHeader;
