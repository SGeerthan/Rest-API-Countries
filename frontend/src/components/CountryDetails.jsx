import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./UserHeader";
import Footer from "./Footer";
import CountryMapModal from "./CountryMapModal";
import BorderCountries from "./BorderCountries";

const CountryDetails = () => {
  const { state: country } = useLocation();

  if (!country) {
    return <div className="text-center text-red-600 mt-12">❌ Country not found.</div>;
  }

  const { name, population, region, capital, flags, languages, currencies } = country;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Flag Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <img
              src={flags.svg}
              alt={`${name.common} flag`}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Country Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-800">{name.common}</h1>

            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">🌍 Region:</span> {region}</p>
              <p><span className="font-semibold">🏛️ Capital:</span> {capital || "N/A"}</p>
              <p><span className="font-semibold">👥 Population:</span> {population.toLocaleString("en-IN")}</p>
              <p><span className="font-semibold">🗣️ Languages:</span> {languages ? Object.values(languages).join(", ") : "N/A"}</p>
              <p><span className="font-semibold">💰 Currencies:</span> {currencies ? Object.values(currencies).map(c => c.name).join(", ") : "N/A"}</p>
            </div>

            {/* Modal */}
            <div className="pt-4">
              <CountryMapModal country={country} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-300" />

        {/* Border Countries Section */}
        <BorderCountries country={country} />
      </main>
      <Footer />
    </div>
  );
};

export default CountryDetails;
