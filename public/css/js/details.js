document.addEventListener("DOMContentLoaded", () => {
    // Add to Recently Played
    const addToRecentlyPlayedBtn = document.getElementById("add-to-recently-played");
    if (addToRecentlyPlayedBtn) {
        addToRecentlyPlayedBtn.addEventListener("click", async (event) => {
            const gameId = event.target.getAttribute("data-game-id");
            try {
                const response = await fetch(`/profile/${userId}/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        gameId,
                        collectionType: "recentlyPlayed",
                    }),
                });

                if (response.ok) {
                    alert("Game added to Recently Played!");
                } else {
                    alert("Failed to add game to Recently Played.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }

    // Add to Favorites
    const addToFavoritesBtn = document.getElementById("add-to-favorites");
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener("click", async (event) => {
            const gameId = event.target.getAttribute("data-game-id");
            try {
                const response = await fetch(`/profile/${userId}/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        gameId,
                        collectionType: "favoriteGames",
                    }),
                });

                if (response.ok) {
                    alert("Game added to Favorites!");
                } else {
                    alert("Failed to add game to Favorites.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});
