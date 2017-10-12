import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { default as passport } from 'passport';
import { default as cookieParser } from 'cookie-parser';
import { default as flash } from 'connect-flash';
import { default as session } from 'express-session';
import { default as methodOverride } from 'method-override';

import path from 'path';

// configure dotenv
import dotenv from 'dotenv';
dotenv.load();

// Models
import User from './models/user';

import matchRoutes from './routes/matches';
import indexRoutes from './routes/index';
import matchupRoutes from './routes/matchups';
    
mongoose.connect(process.env.DB_URL);

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

import moment from 'moment';
app.locals.moment = moment;

app.use(session({
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

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use('/', indexRoutes);
app.use('/matches', matchRoutes);
app.use('/matchups', matchupRoutes);

const port = process.env.PORT || 8000;

app.listen(port);
