//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
})

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save()
    .then(art => res.render("secrets"));
});

app.post("/login", function(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    User.findOne({email: user})
    .then(function(data){
        if(data.password === pass)
        res.render("secrets");
    })
    .catch(err=> res.send("User not found"));
});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});
