require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err) => {
            if (err){
                res.send(err);
            }else {
                res.render("secrets");
            }
        })
    });
   
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, foundUser) => {
        if(err){
            res.send("User not found");
        }else{
            if(foundUser === null || foundUser === ""){
                res.send("user not found");
            }else{
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }else{
                        res.send("Wrong password, try again!!");
                    }
                });
            }
        }
    })
})

app.listen(3030, function() {
    console.log("Server started on port 3030");
  });
  