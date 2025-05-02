import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Register";
import Home from "./pages/Home";
import CountriesList from "./components/CountryList";
import CountryDetails from "./components/CountryDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserPage from "./pages/UserPage";
import AboutPage from "./pages/AboutPage";
import MyFavouriteCountry from "./pages/MyFavouriteCountry";
import TrendingPage from "./pages/TrendingPage";
import CountryGamePage from "./pages/CountrygGamePage";
import { TrophySpin } from "react-loading-indicators";
import { SessionProvider, useSession } from "./contexts/SessionContext";

// ✅ PrivateRoute wrapper component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useSession();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TrophySpin color="#32cd32" size="large" text="exploring" textColor="" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/trending" element={<TrendingPage />} />

      {/* ✅ Protected Routes */}
      <Route
        path="/profile"
        element={<PrivateRoute><UserPage /></PrivateRoute>}
      />
      <Route
        path="/countries"
        element={<PrivateRoute><CountriesList /></PrivateRoute>}
      />
      <Route
        path="/countries/:name"
        element={<PrivateRoute><CountryDetails /></PrivateRoute>}
      />
      <Route
        path="/fav"
        element={<PrivateRoute><MyFavouriteCountry /></PrivateRoute>}
      />
      <Route
        path="/game"
        element={<PrivateRoute><CountryGamePage /></PrivateRoute>}
      />
    </Routes>
  );
}

function App() {
  return (
    <SessionProvider>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </SessionProvider>
  );
}

export default App;
