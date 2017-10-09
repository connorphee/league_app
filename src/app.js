import { default as express } from 'express';
const app = express();
import { default as bodyParser } from 'body-parser';
import { default as mongoose } from 'mongoose';
import { default as passport } from 'passport';
import { default as cookieParser } from 'cookie-parser';
import { default as LocalStrategy } from 'passport-local';
import { default as flash } from 'connect-flash';
import { default as session } from 'express-session';
import { default as methodOverride } from 'method-override';

/*eslint-disable */
import { default as path } from 'path';

// configure dotenv
import { default as dotenv } from 'dotenv';
dotenv.load();


// Models
import { User } from './models/user';
import { default as Match } from './models/match';
import { default as Matchup } from './models/matchup';

import { default as matchRoutes } from './routes/matches';
import { default as indexRoutes } from './routes/index';
import { default as matchupRoutes } from './routes/matchups';
    
mongoose.connect(process.env.DB_URL);

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.locals.moment = require('moment');

app.use(session({
    secret: 'Every person you meet knows something you don\'t',
    resave: false,
    saveUninitialized: false,
    cookie: {_expires: 600000}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use('/', indexRoutes);
app.use('/matches', matchRoutes);
app.use('/matchups', matchupRoutes);

var port = process.env.PORT || 8000

app.listen(port);
