const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Models
const User = require('./models/user');
const Match = require('./models/match');
const Matchup = require('./models/matchup');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.send('Hello World');
})

app.listen(8000);