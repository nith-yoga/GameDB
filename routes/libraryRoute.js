const express = require('express');
const axios = require('axios');
const router = express.Router();

// /library route
router.get('/', (req, res) => {
    res.render('library', {title: "Library"});
})

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
        console.log("RAWG Game Data:", gameData);

        // Fetch digital deals from Cheapshark API
        const dealsResponse = await axios.get('https://www.cheapshark.com/api/1.0/deals', {
            params: { title: gameData.name },
        });

        const gameDeals = dealsResponse.data;
        console.log("CheapShark Deals:", gameDeals);

        const storesResponse = await axios.get('https://www.cheapshark.com/api/1.0/stores');
        const stores = storesResponse.data;

        const storeMap = stores.reduce((map, store) => {
            map[store.storeID] = store.storeName;
            return map;
        }, []);

        const filteredDeals = gameDeals
            .filter(deal => parseFloat(deal.savings) > 0)
            .map(deal => ({
                ...deal,
                storeName: storeMap[deal.storeID] || "Unkown Store",
            }));

        res.render('gameDetails', {
            title: gameData.name,
            game: gameData,
            deals: filteredDeals.length > 0 ? filteredDeals : null,
        });

    } catch (error) {
        console.error("Error fetching game details or deals:", error.message);
        res.status(500).send("Error fetching game data");
    }
});

module.exports = router;