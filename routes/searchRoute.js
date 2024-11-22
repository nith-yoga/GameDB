const express = require('express');
const axios = require('axios');
const router = express.Router();

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

// Search Route
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                key: process.env.RAWGAPI_KEY,
                page_size: 16,
                search: query
            }
        });

        const games = response.data.results;

        const gamesWithBoxArt = await Promise.all(games.map(async (game) => {
            const boxArtUrl = await getImageFromGiantBomb(game.name);
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