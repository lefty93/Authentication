//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();



// set the view engine to ejs
app.set('view engine', 'ejs');

// used to display static file
app.use(express.static('public'));

// used to read the data received in application/x-www-form-urlencoded format on Node server
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose setup
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render("home");
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.get('/register', (req, res) => {
    res.render("register")
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    });
})

app.post('/login', (req, res) => {
    const useremail = req.body.username;
    const userpassword = req.body.password;

    User.findOne({ email: useremail }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === userpassword) {
                    res.render("secrets");
                }
            }
        }
    });
});




app.listen(3000, () => {
    console.log("listening on port 3000")
})
