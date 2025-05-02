import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-100 to-slate-200 text-gray-800 px-6 py-16 md:px-20 lg:px-40 font-sans">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
        <img
          src="https://wallpaperaccess.com/full/1380084.jpg"
          alt="World Map"
          className="w-full md:w-1/2 rounded-3xl shadow-xl object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Explore the World with Us
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Dive deep into the wonders of the world. From hidden islands to major continents, we provide engaging and reliable country data for explorers, students, and curious minds.
          </p>
        </div>
      </div>

      {/* Second Section */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Reliable Data</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our information is fetched directly from the{" "}
            <a
              href="https://restcountries.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              REST Countries API
            </a>
            , ensuring you always have the most recent data. It's trusted by developers, educators, and travelers around the world.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2"
          alt="International Flags"
          className="w-full md:w-1/2 rounded-3xl shadow-xl object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default AboutUs;
