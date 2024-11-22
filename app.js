require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');

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

// MongooseDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Session handling
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Search Routes
const searchRoute = require('./routes/searchRoute');
app.use('/', searchRoute);

// Registration & Login Routes
const authRoute = require('./routes/authenticationRoute');
const loginRoute = require('./routes/loginRoute');
app.use('/api/auth', authRoute);
app.use('/api/auth', loginRoute)
// GET Login/Register pages
app.get('/login', (req, res) => {
    res.render('login', { title: "Login" });
});
app.get('/register', (req, res) => {
    res.render('register', {title: "Register" });
})

// Profile Route
app.get('/profile', (req, res) => {
    res.render('profile', { title: "Profile", user: req.session.user });
});

// Library Routes
const libraryRoutes = require('./routes/libraryRoute');
app.use('/library', libraryRoutes);

// Homepage Route
app.get('/', (req, res) => {
    res.render('index', {title: "Game DB" });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


  