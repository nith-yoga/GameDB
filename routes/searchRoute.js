const express = require('express');
const axios = require('axios');
const router = express.Router();

// Function to fetch box art from Giant Bomb API
async function getGiantBombGameId(gameName) {
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
            return response.data.results[0].id;
        }

        return null;
    } catch (error) {
        console.error('Error fetching box art from Giant Bomb:', error.message);
        return null;
    }
}

async function getBoxArtFromGiantBomb(gameId) {
    try {
        const response = await axios.get(`https://www.giantbomb.com/api/game/${gameId}/`, {
            params: {
                api_key: process.env.GBOMBAPI_KEY,
                format: 'json'
            }
        });

        if (response.data && response.data.results && response.data.results.image) {
            return response.data.results.image.original_url;
        }

        return null;
    } catch (error) {
        console.error("Error fetching box art from Giant Bomb:", error.message);
        return null;
    }
}

// Search Route
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                key: process.env.RAWGAPI_KEY,
                page_size: 10,
                search: query
            }
        });

        const games = response.data.results;

        const gamesWithBoxArt = await Promise.all(games.map(async (game) => {
            const giantBombGameId = await getGiantBombGameId(game.id);
            const boxArtUrl = giantBombGameId ? await getBoxArtFromGiantBomb(giantBombGameId) : null;
            
            return { 
                ...game, 
                boxArtImageUrl: boxArtUrl 
            };
        }));

        res.render('searchResults', { 
            query, 
            results: gamesWithBoxArt, 
        });
    } catch (error) {
        console.error("Error in search route:", error.message);
        res.status(500).send("Error fetching search results.");
    }
});

module.exports = router;