async function removeGame(gameId, userId) {
    try {
        const response = await fetch(`/api/users/${userId}/games/${gameId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            alert("Game removed from your collection.");
            location.reload();
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (err) {
        console.error("Error removing gme:", err);
        alert("An error occurred. Please try again.");
    }
}