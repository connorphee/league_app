import express from 'express';
const router  = express.Router();
import passport from 'passport';
import User from '../models/user';

//root route
router.get('/', (req, res) =>{
    if (req.user) {
      res.redirect('/matches')
    } else {
      res.render('landing');
    }
});

// show register form
router.get('/register', (req, res) => {
   res.render('register', {page: 'register'}); 
});

//handle sign up logic
router.post('/register', (req, res) =>  {
  const newUser = new User({
    username: req.body.username,
    email:    req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  User.register(newUser, req.body.password, (err) => {
    if(err){
      return res.render('register', {error: err.message});
    }
    passport.authenticate('local')(req, res, () =>{
      req.flash('success', 'Successfully Signed Up! Nice to meet you ' + req.body.username);
      res.redirect('/matches'); 
    });
  });
});

//show login form
router.get('/login', (req, res) => {
   res.render('login', {page: 'login'}); 
});

//handling login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/matches',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Successfully logged in!'
    }));

// logout route
router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success', 'See you later!');
   res.redirect('/');
});

export default router;
