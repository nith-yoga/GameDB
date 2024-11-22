const express = require('express');
const axios = require('axios');
const router = express.Router();

// library route
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                key: process.env.RAWGAPI_KEY,
                dates: '1900-01-01,2004-12-31',
                page_size: 20
            }
        });

        let games = response.data.results

        games = await Promise.all(games.map(async (game) => {
            const boxArtImageUrl = await getImageFromGiantBomb(game.name);
            const publishers = await getGamePublishers(game.id);
            return {
                ...game,
                imageUrl: getGameImage(game),
                boxArtImageUrl,
                publishers
            };
        }));

        res.render('library', { title: "Library", games: games });
    } catch (error) {
        console.error("Error in /library route:", error.message);
        res.status(500).send("Error fetching games. Check the logs for details.");
    }
});

// Function to pull image from RAWG API
function getGameImage(gameData) {
    if (gameData.background_image) {
        return gameData.background_image;
    } else if (gameData.clip && gameData.clip.image) {
        return gameData.clip.image;
    } else {
        return 'Image not found.'
    }
}

// Function to get Publisher information from Giant Bomb
async function getGamePublishers(gameId) {
    try {
        const response = await axios.get(`https://www.giantbomb.com/api/game/${gameId}/`, {
            params: {
                api_key: process.env.GBOMBAPI_KEY,
                format: 'json'
            }
        });

        const publishers = response.data.results.publishers || [];
        return publishers.map(pub => pub.name).join(', ');
    } catch (error) {
        console.error("Error fetching publishers:", error);
        return "Unknown Publisher";
    }
}

// Route to show game details and reviews
router.get('/game/:gameId', async (req, res) => {
    const gameId = req.params.gameId;

    try {
        // Fetch game data from RAWG API
        const gameResponse = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWGAPI_KEY}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        const gameData = gameResponse.data;
        console.log("Game retrieved:", gameData);

        const imageUrl = getGameImage(gameData);

        // Fetch main image from Giant Bomb API
        const boxArtImageUrl = await getImageFromGiantBomb(gameData.name);

        // Fetch digital deals from Cheapshark API
        const dealsResponse = await axios.get('https://www.cheapshark.com/api/1.0/deals', {
            params: { 
                title: gameData.name,
                onSale: 1,
                exact: 1,
                sortBy: 'Store'
            },
        });

        const gameDeals = dealsResponse.data;

        const publishers = await getGamePublishers(gameId);
        
        res.render('gameDetails', {
            title: gameData.name,
            game: gameData,
            deals: gameDeals,
            imageUrl: imageUrl,
            boxArtImageUrl: boxArtImageUrl,
            publishers: publishers,
        });

    } catch (error) {
        console.error("Error fetching game details or deals:", error.message);
        res.status(500).send("Error fetching game data");
    }
});

// Function to fetch box art from Giant Bomb API
async function getImageFromGiantBomb(gameName) {
    try {
        const response = await axios.get(`https://www.giantbomb.com/api/search/`, {
            params: {
                api_key: process.env.GBOMBAPI_KEY,
                format: 'json',
                query: gameName,
                resources: 'game',
            },
        });

        if (response.data && response.data.results && response.data.results[0]) {
            const game = response.data.results[0];
            if (game.image && game.image.original_url) {
                return game.image.original_url;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching box art from Giant Bomb:', error.message);
        return null;
    }
}

module.exports = router;