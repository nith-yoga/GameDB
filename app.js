require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "https://media.rawg.io/", "https://www.giantbomb.com", "https://www.cheapshark.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
    }
}))

const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.resolve('./views'));
app.use(express.static(path.resolve('./public')));


// Routes
const searchRoute = require('./routes/searchRoute');
app.use('/', searchRoute);

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


  