var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// emailjs configuration
// TODO: separate config file
const email= require('emailjs/email'),
server = email.server.connect({
    user: 'winistein@gmail.com',
    password: 'W1LD4N5N',
    host: 'smtp.gmail.com',
    ssl: true
});

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
    if(found){
      // generate random password
      // TODO: create separate middleware to handle this
      const possible  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let text;
      function randomString(){
        text = '';
        for (let i=0; i<10; i+=1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
      const reset_pass = randomString();
      const link = randomString();

      // TODO: programmatically change baseurl (localhost)
      const reset_link = 'http://localhost:8000/account/resetpass/'+link;

      // save to database
      User.update({username:username},{$set:{reset_pass:reset_pass, reset_link:reset_link}}, function(err){
        if(!err){
          const title = 'reset pass';
          const html  = '<p> Here is your new password <strong>'+ reset_pass + '</strong> Click here to reset : <a href="'+ reset_link+ '"> Reset </a> </p>';

          // send email
          const message = {
              text: 'Admin League Cup',
              from: 'Reset Password <winistein@gmail.com>',
              to: '<'+email+'>',
              subject: title,
              attachment: [
                  { data:html, alternative:true }
              ]
          };
          server.send(message, (err, message) => {
              console.log(err || message);
          });
          // TODO: beautify error message
          // redirect to login page
          res.send('<h2> Success! </h2> <p> A reset link sent to <strong>' + email + '</strong>. Please click the url to activate your new password </p> <meta http-equiv="refresh" content="3;url=./login" />');
        }
      })
    } else {
      res.send('<h3> Username or email not found! </h3> <p> Redirecting to login page... </p> <meta http-equiv="refresh" content="3;url=./login" />');
    }
  })
})

// handle reset link
router.get("/account/resetpass/:link", function(req, res){
  const link = req.protocol + '://' + req.get('host') + req.originalUrl;

  // check if link is match
  User.findOne({reset_link:link},function(err, found){
    if(found){
      // change hash+salt password based on reset_pass
      // 
    } else {
      res.send('Sorry, your link is invalid');
    }
  })
})

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      reset_link: "",
      reset_pass: ""
    });
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
