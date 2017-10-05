var express = require("express");
var router  = express.Router({mergeParams: true});
var Match = require("../models/match");
var Matchup = require('../models/matchup');
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("matches/new");
});

router.get("/", middleware.isLoggedIn, function(req, res) {
  Match.find({'author.username': req.user.username}, function (err, matches) {
    res.render("matches/show",{matches: matches});
  })
})

router.post("/", middleware.isLoggedIn, function(req, res){
  Match.create(req.body.match, function(err, match){
    if(err){
      console.log(err);
    } else {
      const info = req;
      const matchup = info.body.champion.toUpperCase() + 'V' + info.body.opponent.toUpperCase();
      const username = info.user.username;
      match = buildMatchObject(match, info);
      match.save();
      updateMatchup(username, matchup, info);

      req.flash('success', 'Created a match!');
      res.redirect('/');
    }
  });
});

function buildMatchObject (match, values) {
  match.author.id = values.user._id;
  match.author.username = values.user.username;
  match.champion = values.body.champion;
  match.opponent = values.body.opponent;
  match.kills = values.body.kills;
  match.deaths = values.body.deaths;
  match.assists = values.body.assists;
  match.build = values.body.build.split(',');
  match.result = values.body.result;

  return match;
}

function buildMatchupObject (matchup, values) {
  matchup.gameCount = 1;
  matchup.username = values.user.username;
  matchup.champion = values.body.champion;
  matchup.opponent = values.body.opponent;
  matchup.wins = values.body.result === 'W' ? 1 : 0;
  matchup.losses = values.body.result === 'L' ? 1 : 0;
  matchup.kills = values.body.kills;
  matchup.deaths = values.body.deaths;
  matchup.assists = values.body.assists;

  return matchup;
}

function updateMatchup (username, matchup, values) {
  Matchup.findOne({matchup : matchup, username : username}, function(err, document) {
    if (document) {
      document.gameCount++;
      values.body.result === 'W' ? document.wins++ :  document.losses++;
      document.kills += parseInt(values.body.kills);
      document.deaths += parseInt(values.body.deaths);
      document.assists += parseInt(values.body.assists);
      document.save();
    } else {
      Matchup.create({"name": "hello"}, function(err, document) {
        if (err) throw err;
        buildMatchupObject(document, values);
        document.matchup = matchup;
        document.save();
      });
    }
  });
}

module.exports = router;
