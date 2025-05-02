import React, { useEffect, useMemo, useState } from "react";

const BorderCountries = ({ country }) => {
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Memoize borders to prevent infinite re-renders
  const borders = useMemo(() => country?.borders || [], [country]);

  useEffect(() => {
    const fetchBorders = async () => {
      if (borders.length === 0) {
        setBorderCountries([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`
        );
        const data = await response.json();
        setBorderCountries(data);
      } catch (err) {
        console.error("Failed to fetch border countries:", err);
        setError("Unable to fetch border countries.");
      } finally {
        setLoading(false);
      }
    };

    fetchBorders();
  }, [borders]); // ✅ Only re-run when borders change

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Border Countries:</h3>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && borderCountries.length === 0 && (
        <p className="text-gray-600">No bordering countries.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {borderCountries.map((bc) => (
          <div
            key={bc.cca3}
            className="bg-white border rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <img
              src={bc.flags.svg || bc.flags.png}
              alt={`${bc.name.common} flag`}
              className="w-16 h-10 object-contain mb-2"
            />
            <h4 className="font-bold text-lg">{bc.name.common}</h4>
            <p className="text-sm text-gray-600">{bc.region}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorderCountries;
