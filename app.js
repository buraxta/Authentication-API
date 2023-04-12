require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});


app.post('/register', async(req, res) => {

    bcrypt.hash(req.body.password, saltRounds,async function(err, hash){
        try {
            const newUser = await User.create({
                email: req.body.username,
                password: hash
             });
             res.render('secrets');
        } catch (error) {
            console.log(error.message);
        }

    })

});

app.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
       const foundUser = await User.findOne({email: username});
       if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result){
            if (result) {
                res.render('secrets');
            }
        })
       }
    } catch (error) {
        console.log(error.message);
    }

})

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});  


const User = new mongoose.model("User", userSchema);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("connected");
    app.listen(3000, (req, res) => {
        console.log("Server started on port 3000");
    })
}).catch((err) => {
    console.log(err);
})

