var express = require('express');
var router = express.Router();
var User = require('../models/users')
var passport=require('passport');
var LocalStrategy =require('passport-local').Strategy;
/* REGISTER LAYOUT*/
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* LOGIN LAYOUT*/
router.get('/login', function(req, res, next) {
    res.render('login');
});
var user_data_global;

/* REGISTER USER */
router.post('/register', function(req, res, next) {
    console.log(req.body.data);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var cypher_username = req.body.cypher_username;
    user_data_global={
        name: name,
        email: email,
        password: password,
        cypher_username: cypher_username
    }

    var newUser = new User({
        name: name,
        email: email,
        password: password,
        cypher_username: cypher_username
    });
    User.createUser(newUser, function (error, user) {
        if (error) {

            req.flash('error_msg', 'User Already Exists');
            //res.redirect('/users/login');
            res.redirect('/users/login');
            //throw error;  //I handled this error duplicate one
        }
        else {
            console.log(user);
            req.flash("success_msg", "Registration Succesfull.");
            res.redirect('/users/login');
        }
    });

});


/* LOGIN USER*/
router.post('/login',
    passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login',failureFlash:true}),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        //res.redirect('/users/' + req.user.username);
        res.redirect('/');
    });

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new LocalStrategy(
    function (username,password,done) {
        User.getUserByUserName(username,function(err,user){
            if(err)
                throw err
            if(!user){
                return done(null,false,{message:'Invalid UserName'});
            }
            User.comparePassword(password,user.password,function (err,isMatch) {
                if(err)
                    throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:'Invalid Password'});
                }
            })
        });
}));

router.get('/logout',function (req, res) {
    req.logout();
    req.flash('success_msg','You Are Logged out');
    res.redirect('/users/login');
})


module.exports = {
    router:router,
    user_data_global:user_data_global
};