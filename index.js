const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');

const db = 'mongodb://localhost:27017/todoAppDB';
const connect = mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
connect.then((db) => {
    console.log("connected to the database!");
}, (err) => console.log(err) );

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs');
app.use(flash());
app.use(session({
    secret: 'secret-key-1960-lorem',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email'
    }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if(err) { return done(err) };

        if(!user) {
            return done(null, false, { message: 'Invalid email!' });
        }

        if(!bcrypt.compareSync(password, user.password) ) {
            return done(null, false, { message: 'Incorrect password!' });
        }

        done(null, user);
    })
}));


passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
        done(null, user);
    });
});


function checkAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}


function checkNotAuth(req, res, next) {
    if(req.isAuthenticated()) {
       return res.redirect('/');
    }

    next();
}

app.get('/', checkAuth, (req, res) => {
    res.statusCode = 200;
    res.render('index.ejs', { username: req.user.username });
})

app.get('/login', checkNotAuth, (req, res) => {
    res.statusCode = 200;
    res.render('login.ejs');
})

app.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuth, (req, res) => {
    res.statusCode = 200;
    res.render('register.ejs');
})

app.post('/register', checkNotAuth, (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })
        .then((user) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/register');
        })
    })
    .catch(err => console.log(err));
})

app.post('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})


app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
})