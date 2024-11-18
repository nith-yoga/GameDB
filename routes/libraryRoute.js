const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('library', {title: "Library"});
})

router.get('/game', (req, res) => {
    res.render('game', { title: "Game" });
})

module.exports = router;