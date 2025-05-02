import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const CountriesCard = ({ image, name, population, region, capital }) => {
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const handleFavoriteSubmit = async (comment, rating) => {
    if (!user) {
      return alert("Please log in to save favorites.");
    }

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return Swal.fire("Error", "Rating must be a number between 1 and 5.", "error");
    }

    try {
      await setDoc(doc(db, "Users", user.uid, "userFavorites", name), {
        country: name,
        comment: comment.trim(),
        rating: Number(rating),
      });

      setIsFavorite(true);
      Swal.fire("Saved!", "This country has been added to your favorites!", "success");
    } catch (error) {
      console.error("Error saving favorite:", error);
      Swal.fire("Error", "Failed to save favorite.", "error");
    }
  };

  const handleOpenSweetAlert = () => {
    if (!user) {
      return Swal.fire("Error", "Please log in to save favorites.", "error");
    }

    Swal.fire({
      title: "Add to Favorites",
      html: `
        <label for="comment" class="swal2-input-label">Comment:</label>
        <input type="text" id="comment" class="swal2-input" placeholder="Your thoughts..." rows="3"/>
        <label for="rating" class="swal2-input-label">Rating (1-5):</label>
        <input id="rating" class="swal2-input" type="number" min="1" max="5" placeholder="1 to 5" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const comment = document.getElementById("comment").value;
        const rating = document.getElementById("rating").value;

        if (!comment || !rating) {
          Swal.showValidationMessage("Both comment and rating are required.");
        }
        return { comment, rating };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleFavoriteSubmit(result.value.comment, result.value.rating);
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition transform hover:scale-105">
      <img
        src={image}
        alt={`${name} flag`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 space-y-1">
        <h2 className="text-lg font-bold">{name}</h2>
        <p><strong>Population:</strong> {population}</p>
        <p><strong>Region:</strong> {region}</p>
        <p><strong>Capital:</strong> {capital}</p>

        {/* Clickable heart and text */}
        <div
          onClick={handleOpenSweetAlert}
          className="flex items-center mt-4 cursor-pointer select-none"
        >
          <span className="text-red-500 text-2xl">{isFavorite ? "❌" : "❤️"}</span>
          <span className="ml-2 text-gray-700 text-sm hover:underline">Add to Favorites</span>
        </div>
      </div>
    </div>
  );
};

export default CountriesCard;
