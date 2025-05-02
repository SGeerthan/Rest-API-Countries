import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiMessageSquare, FiStar, FiLock } from 'react-icons/fi';
import { useSession } from '../contexts/SessionContext';
import UserHeader from './UserHeader';

const TrendingCountries = () => {
  const [trendingCountries, setTrendingCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSession();

  useEffect(() => {
    const fetchTrendingCountries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const allFavorites = [];

        for (const userDoc of usersSnapshot.docs) {
          const favoritesSnapshot = await getDocs(
            collection(db, "Users", userDoc.id, "userFavorites")
          );

          favoritesSnapshot.docs.forEach(doc => {
            allFavorites.push({
              ...doc.data(),
              userId: userDoc.id,
              userName: userDoc.data().firstName,
              timestamp: doc.data().timestamp || new Date().toISOString()
            });
          });
        }

        const countryStats = allFavorites.reduce((acc, fav) => {
          if (!acc[fav.country]) {
            acc[fav.country] = {
              country: fav.country,
              totalRatings: 0,
              averageRating: 0,
              totalComments: 0,
              comments: [],
              users: new Set()
            };
          }

          acc[fav.country].totalRatings += fav.rating;
          acc[fav.country].totalComments++;
          acc[fav.country].comments.push({
            text: fav.comment,
            rating: fav.rating,
            userName: fav.userName,
            timestamp: fav.timestamp
          });
          acc[fav.country].users.add(fav.userId);

          return acc;
        }, {});

        const trending = Object.values(countryStats).map(stat => ({
          ...stat,
          averageRating: stat.totalRatings / stat.totalComments,
          uniqueUsers: stat.users.size,
          users: undefined
        }));

        trending.sort((a, b) => {
          if (b.uniqueUsers !== a.uniqueUsers) {
            return b.uniqueUsers - a.uniqueUsers;
          }
          return b.averageRating - a.averageRating;
        });

        setTrendingCountries(trending.slice(0, 5));
      } catch (error) {
        setError(error + "Failed to load trending countries.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCountries();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow-md mt-6">
        <FiLock className="text-gray-400 text-3xl mx-auto mb-2" />
        <p className="text-gray-600">
          Please <Link to="/login" className="text-green-600 hover:underline">login</Link> to view trending countries.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md mt-6 animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md mt-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 py-6 bg-gray-50 min-h-screen">
      <UserHeader />

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <FiTrendingUp className="text-green-500 text-2xl" />
          Trending Countries
        </h2>

        {trendingCountries.length === 0 ? (
          <p className="text-center text-gray-500">No trending countries yet. Be the first to add a favorite!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {trendingCountries.map((country, index) => (
              <div key={index} className="p-4 bg-green-50 hover:bg-green-100 transition rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{country.country}</h3>
                    <div className="flex items-center text-sm text-gray-600 gap-1">
                      <FiStar className="text-yellow-400" />
                      <span>{country.averageRating.toFixed(1)} ({country.totalComments} reviews)</span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                    {country.uniqueUsers} users
                  </span>
                </div>

                {country.comments.length > 0 && (
                  <div className="mt-3 text-sm text-gray-700 italic border-t pt-2">
                    <div className="flex items-center gap-1 mb-1">
                      <FiMessageSquare className="text-gray-400" />
                      <span className="font-medium">{country.comments[0].userName}:</span>
                    </div>
                    <p>"{country.comments[0].text}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Link
          to="/trending"
          className="mt-6 inline-block text-green-600 hover:text-green-700 text-sm font-medium underline text-center w-full"
        >
          View All Trending Countries
        </Link>
      </div>
    </div>
  );
};

export default TrendingCountries;
