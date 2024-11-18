const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.resolve('./views'));
app.use(express.static(path.resolve('./public')));


// Routes
const libraryRoutes = require('./routes/libraryRoute');
app.use('/library', libraryRoutes);

app.get('/', (req, res) => {
    res.render('index', {title: "Game DB" });
})

app.get('/profile', (req, res) => {
    res.render('profile', { title: "Profile" });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});