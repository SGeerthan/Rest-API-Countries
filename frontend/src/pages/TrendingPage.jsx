import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FiTrendingUp, FiMessageSquare, FiStar, FiUsers, FiLock } from 'react-icons/fi';
import { Link, Navigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

const TrendingPage = () => {
  const [trendingCountries, setTrendingCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('users');
  const { user } = useSession();

  useEffect(() => {
    const fetchTrendingCountries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const allFavorites = [];

        for (const userDoc of usersSnapshot.docs) {
          try {
            const userData = userDoc.data();
            if (!userData || !userData.firstName) continue;

            const favoritesSnapshot = await getDocs(
              collection(db, "Users", userDoc.id, "userFavorites")
            );

            favoritesSnapshot.docs.forEach(doc => {
              const favoriteData = doc.data();
              if (!favoriteData || !favoriteData.country) return;

              allFavorites.push({
                country: favoriteData.country,
                rating: favoriteData.rating || 0,
                comment: favoriteData.comment || '',
                userId: userDoc.id,
                userName: userData.firstName,
                timestamp: favoriteData.timestamp || new Date().toISOString()
              });
            });
          } catch (userError) {
            console.error(`Error processing user ${userDoc.id}:`, userError);
            continue;
          }
        }

        const countryStats = allFavorites.reduce((acc, fav) => {
          if (!fav.country) return acc;

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

          acc[fav.country].totalRatings += Number(fav.rating) || 0;
          acc[fav.country].totalComments++;
          acc[fav.country].comments.push({
            text: fav.comment || '',
            rating: Number(fav.rating) || 0,
            userName: fav.userName || 'Anonymous',
            timestamp: fav.timestamp
          });
          acc[fav.country].users.add(fav.userId);

          return acc;
        }, {});

        const trending = Object.values(countryStats)
          .filter(stat => stat.totalComments > 0)
          .map(stat => ({
            ...stat,
            averageRating: stat.totalRatings / stat.totalComments,
            uniqueUsers: stat.users.size,
            users: undefined
          }));

        trending.sort((a, b) => {
          if (sortBy === 'users') {
            if (b.uniqueUsers !== a.uniqueUsers) {
              return b.uniqueUsers - a.uniqueUsers;
            }
            return b.averageRating - a.averageRating;
          } else {
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            return b.uniqueUsers - a.uniqueUsers;
          }
        });

        setTrendingCountries(trending);
      } catch (error) {
        console.error("Error fetching trending countries:", error);
        setError("Failed to load trending countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCountries();
  }, [sortBy, user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserHeader/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <FiTrendingUp className="text-green-500" />
          Trending Countries
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setSortBy('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
              sortBy === 'users'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiUsers />
            Most Popular
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
              sortBy === 'rating'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiStar />
            Highest Rated
          </button>
        </div>
      </div>

      {trendingCountries.length === 0 ? (
        <div className="text-center py-16">
          <FiLock className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Trending Countries Yet</h2>
          <p className="text-gray-500 mb-6">
            Be the first to add a favorite country and start the trend!
          </p>
          <Link
            to="/countries"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {trendingCountries.map((country, index) => (
            <div
              key={index}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{country.country}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <FiUsers className="text-green-500" />
                      <span>{country.uniqueUsers} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400" />
                      <span>{country.averageRating.toFixed(1)} / {country.totalComments} reviews</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/countries/${country.country}`}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full hover:brightness-110 transition"
                >
                  View
                </Link>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <FiMessageSquare className="text-gray-500" />
                  Recent Comments
                </h3>
                <div className="space-y-4">
                  {country.comments
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 3)
                    .map((comment, idx) => (
                      <div
                        key={idx}
                        className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{comment.userName}</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <FiStar />
                              <span className="text-sm text-gray-600">{comment.rating}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default TrendingPage;
