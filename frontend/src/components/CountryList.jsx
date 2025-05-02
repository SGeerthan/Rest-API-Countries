import React, { useEffect, useState } from "react";
import CountriesCard from "./CountriesCard";
import { Link } from "react-router-dom";
import { BlinkBlur } from "react-loading-indicators";

const CountriesList = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [continentFilter, setContinentFilter] = useState("All");

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      let url = "";

      try {
        if (searchQuery) {
          url = `https://restcountries.com/v3.1/name/${searchQuery}`;
        } else if (continentFilter !== "All") {
          url = `https://restcountries.com/v3.1/region/${continentFilter}`;
        } else {
          url = `https://restcountries.com/v3.1/all`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("No matching countries found");
        const data = await res.json();

        const filteredData =
          searchQuery && continentFilter !== "All"
            ? data.filter((country) => country.region === continentFilter)
            : data;

        setCountriesData(filteredData);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [searchQuery, continentFilter]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleContinentChange = (e) => setContinentFilter(e.target.value);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 bg-gradient-to-br from-white to-green-50 min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="🔍 Search by country name"
          className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <select
          value={continentFilter}
          onChange={handleContinentChange}
          className="w-full md:w-1/4 px-4 py-3 rounded-xl border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          <option value="All">🌍 All Continents</option>
          <option value="Africa">🌍 Africa</option>
          <option value="Americas">🌎 Americas</option>
          <option value="Asia">🌏 Asia</option>
          <option value="Europe">🌍 Europe</option>
          <option value="Oceania">🌊 Oceania</option>
          <option value="Antarctic">❄️ Antarctic</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
        </div>
      ) : countriesData.length > 0 ? (
        // Country Cards
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {countriesData.map((country) => (
            <Link
              to={`/countries/${country.name.common}`}
              state={country}
              key={country.cca3}
              className="transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <CountriesCard
                image={country.flags.svg}
                name={country.name.common}
                population={country.population.toLocaleString("en-IN")}
                region={country.region}
                capital={country.capital?.[0] || "N/A"}
              />
            </Link>
          ))}
        </div>
      ) : (
        // Empty State
        <p className="text-center text-gray-600 text-lg mt-20">
          No countries found for{" "}
          <span className="font-semibold text-black">
            "{searchQuery || continentFilter}"
          </span>
        </p>
      )}
    </div>
  );
};

export default CountriesList;
