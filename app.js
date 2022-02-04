const express = require("express");
const bodyParser = require("body-parser");
const https = require ("https")
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require ('dotenv').config();

const app = express();

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shamstanweerYousuf@gmail.com",
        pass: process.env.GPASS
    }
});

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MDB)


const mailingSchema = {
    nameF: String,
    nameL: String,
    email: String
};

const Mail = mongoose.model("Mail", mailingSchema);


app.get("/", function (req, res){
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/", function (req, res){
    const newUser = new Mail({
        nameF: req.body.fname,
        nameL: req.body.lname,
        email: req.body.email
    });
    newUser.save();

    let details = {
        from: "shamstanweeryousuf@gmail.com",
        to: req.body.email,
        subject: {
            prepared: true,
            value: '=?UTF-8?B?'+new Buffer("Welcome E-mail").toString('base64')+'?='
        },
        html: "<h1>Hello</h1> <p>Thank you for signing up.</p>"
    }
    mailTransporter.sendMail(details,(err)=>{
        if(err){
            console.log("it has an error", err);
            res.sendFile(__dirname+"/failure.html")
        } else{
            console.log("email has sent successfully");
            res.sendFile(__dirname+"/success.html");
        }
    });
});
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});