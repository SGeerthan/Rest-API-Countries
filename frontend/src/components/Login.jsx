import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      //toast.success("User logged in Successfully", {
        //position: "top-center",
      //});
      alert("User logged in Successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {/* Back Home Icon */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-600 hover:text-green-600 cursor-pointer transition-all duration-300 transform hover:scale-110"
        title="Go to Home"
      >
        <FaArrowLeft size={24} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in"
      >
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h3>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email address</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          New user?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Register Here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
