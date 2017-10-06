const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').load();

// Models
const User = require('./models/user');
const Match = require('./models/match');
const Matchup = require('./models/matchup');

const   matchRoutes = require("./routes/matches"),
        indexRoutes      = require("./routes/index"),
        matchupRoutes = require("./routes/matchups");
    
mongoose.connect(process.env.DB_URL);

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: 'Every person you meet knows something you don\'t',
    resave: false,
    saveUninitialized: false,
    cookie: {_expires: 600000}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/matches", matchRoutes);
app.use("/matchups", matchupRoutes);

var port = process.env.PORT || 8000

app.listen(port, function() {
    console.log("App is running on port " + port);
});