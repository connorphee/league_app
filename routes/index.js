var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    if (req.user) {
      res.redirect('/matches')
    } else {
      res.render("landing");
    }
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

// show reset password page
router.get("/reset", function(req, res){
  res.render("reset", {page: 'reset'});
})

router.post("/reset", function(req, res){
  const username  = req.body.username,
        email     = req.body.email
  // check if username && email exist
  User.findOne({$and:[{username:username}, {email:email}]}, function(err, found){
    // TODO: beautify error message
    if(found){
      res.send('<h2> Success! </h2> <p> A reset link sent to <strong>' + email + '</strong>. Please click the url to activate your new password </p> <meta http-equiv="refresh" content="3;url=./login" />');
    } else {
      res.send('<h3> Username or email not found! </h3> <p> Redirecting to login page... </p> <meta http-equiv="refresh" content="3;url=./login" />');
    }
  })
})

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/matches");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/matches",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Successfully logged in!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/");
});


module.exports = router;
