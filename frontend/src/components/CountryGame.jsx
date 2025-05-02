import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDrag, useDrop } from "react-dnd";
import Confetti from "react-confetti";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CountryCard = ({ country, isDisabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "country",
    item: { name: country.name },
    canDrag: !isDisabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 m-1 rounded-lg cursor-pointer transition-all duration-200
        bg-gradient-to-r from-purple-100 to-blue-100 shadow-md hover:shadow-lg
        ${isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        hover:-translate-y-1 active:scale-95 border-2 border-white`}
    >
      <span className="font-semibold text-gray-800">{country.name}</span>
    </div>
  );
};

const FlagSlot = ({ country, onDrop, matched, isDisabled }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "country",
    drop: (item) => !isDisabled && onDrop(item.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`relative h-32 w-full rounded-xl shadow-lg transition-all
        ${isOver && !isDisabled ? "ring-4 ring-yellow-400 scale-105" : ""}
        ${matched ? "border-4 border-green-400" : "border-2 border-gray-200"}
        bg-cover bg-center backdrop-blur-sm`}
      style={{ backgroundImage: `url(${country.flag})` }}
    >
      {matched && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white 
          p-2 text-center font-bold rounded-b-xl animate-pulse">
          ✅ {country.name}
        </div>
      )}
    </div>
  );
};

const CountryGame = () => {
  const [countries, setCountries] = useState([]);
  const [shuffledNames, setShuffledNames] = useState([]);
  const [matched, setMatched] = useState({});
  const [isWinning, setIsWinning] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [scores, setScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Start control

  const db = getFirestore();

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft <= 0) {
      setGameOver(true);
      saveScore(Object.keys(matched).length);
    }
  }, [timeLeft, gameOver, gameStarted]);

  useEffect(() => {
    if (Object.keys(matched).length === countries.length && countries.length > 0) {
      setIsWinning(true);
      setGameOver(true);
      saveScore(countries.length);
      setTimeout(() => setIsWinning(false), 5000);
    }
  }, [matched]);

  useEffect(() => {
    if (showScores) {
      const fetchScores = async () => {
        const q = query(collection(db, "gameScores"), orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const fetchedScores = snapshot.docs.map(doc => doc.data());
        setScores(fetchedScores);
      };
      fetchScores();
    }
  }, [showScores]);

  const handleDrop = (slotCountry, droppedName) => {
    if (gameOver) return;
    if (slotCountry.name === droppedName) {
      setMatched(prev => ({ ...prev, [slotCountry.name]: true }));
    }
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setMatched({});
    setGameOver(false);
    setTimeLeft(30);
    setIsWinning(false);
    setGameStarted(true);

    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const allCountries = res.data.map(c => ({
        name: c.name.common,
        flag: c.flags.svg,
      }));
      const selected = shuffleArray(allCountries).slice(0, 10);
      setCountries(selected);
      setShuffledNames(shuffleArray(selected.map(c => ({ ...c }))));
    });
  };

  const saveScore = (score) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const scoreData = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        score,
        timestamp: serverTimestamp(),
      };

      addDoc(collection(db, "gameScores"), scoreData)
        .then(() => console.log("Score saved!"))
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-800 p-8 relative">

      {!gameStarted && (
        <div className="flex justify-center items-center min-h-screen">
          <button
            onClick={startGame}
            className="text-white text-3xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            🎮 Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          {isWinning && <Confetti recycle={false} numberOfPieces={800} />}
          <h1 className="text-4xl font-bold text-center mb-6 text-transparent 
            bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 animate-pulse">
            🌟 Flag Match Challenge 🌟
          </h1>

          <div className="text-center text-white text-xl mb-6">
            ⏳ Time Left: <span className="font-bold">{timeLeft}s</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl text-white font-semibold mb-4 text-center">🧩 Match the Flags</h2>
              <div className="grid grid-cols-2 gap-6">
                {countries.map((country) => (
                  <FlagSlot
                    key={country.name}
                    country={country}
                    onDrop={(name) => handleDrop(country, name)}
                    matched={matched[country.name]}
                    isDisabled={gameOver}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-white font-semibold mb-4 text-center">🎯 Drag Country Names</h2>
              <div className="grid grid-cols-2 gap-4">
                {shuffledNames.map((country, i) => (
                  <CountryCard key={i} country={country} isDisabled={gameOver} />
                ))}
              </div>
            </div>
          </div>

          {gameOver && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="text-4xl font-bold text-white text-center">
                ⏰ Time's Up!<br />
                ✅ Your Score: {Object.keys(matched).length}
              </div>
            </div>
          )}

          {isWinning && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="text-6xl font-bold text-yellow-400 animate-bounce">
                🎉 VICTORY! 🎊
              </div>
            </div>
          )}

          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowScores(!showScores)}
              className="text-4xl hover:scale-125 transition-transform"
              title="View Top Scores"
            >
              🏆
            </button>
          </div>

          {showScores && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-80 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center text-blue-700">🏅 Top Scores</h2>
                <ul className="space-y-2">
                  {scores.map((score, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{score.userName}</span>
                      <span>{score.score}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowScores(false)}
                  className="mt-4 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CountryGame;
