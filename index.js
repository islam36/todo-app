const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');

const db = 'mongodb+srv://mongo_user:mongo_user123@cluster0.kihsa.mongodb.net/todo-app?retryWrites=true&w=majority';
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

//configuring passport
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


//check if user is authenticated
//if no user is authenticated, redirect to '/login'
function checkAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

//check if user doesn't need authentication
function checkNotAuth(req, res, next) {
    if(req.isAuthenticated()) {
       return res.redirect('/');
    }

    next();
}

app.get('/', checkAuth, (req, res) => {
    res.statusCode = 200;
    res.render('index.ejs', { username: req.user.username, todos: req.user.todos });
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
    User.findOne({ email: req.body.email })
    .then((user) => {
        if (user == null) {
            bcrypt.hash(req.body.password, 10)//make a hash
                .then((hash) => {
                    User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
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
        }
        else {
            res.redirect('register.ejs');
        }
    })
    .catch(err => console.log(err))
})

app.post('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})


app.post('/todos', checkAuth, (req, res) => {
    if(req.body != null) {
        User.findById(req.user._id)
        .then((user) => {
            user.todos.push(req.body);
            user.save()
            .then((user) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                let todo = user.todos[user.todos.length - 1];
                res.json(todo);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
})


app.delete('/todos/:ID', checkAuth, (req, res) => {
    User.findById(req.user._id)
    .then((user) => {
        for(let i = 0; i < user.todos.length; i++) {
            if(user.todos[i]._id.toString() == req.params.ID) {
                user.todos.splice(i, 1);
                break;
            }
        }

        user.save()
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ id: req.params.ID });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => {
    console.log(`server running on ${host}:${port}`);
})