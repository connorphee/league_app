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
      const matchup = info.body.champion + 'V' + info.body.opponent;
      const username = info.user.username;
      match.author.id = info.user._id;
      match.author.username = info.user.username;
      match.champion = info.body.champion;
      match.opponent = info.body.opponent;
      match.kills = info.body.kills;
      match.deaths = info.body.deaths;
      match.assists = info.body.assists;
      match.build = info.body.build.split(',');
      match.result = info.body.result;
      match.save();

      Matchup.findOne({matchup : matchup, username : username}, function(err, document) {
        if (document) {
          document.gameCount++;
          info.body.result === 'W' ? document.wins++ :  document.losses++;
          document.kills += parseInt(info.body.kills);
          document.deaths += parseInt(info.body.deaths);
          document.assists += parseInt(info.body.assists);
          document.save();
        } else {
          Matchup.create({"name": "hello"}, function(err, document) {
            if (err) throw err;
            
            document.matchup = matchup;
            document.gameCount = 1;
            document.username = info.user.username;
            document.champion = info.body.champion;
            document.opponent = info.body.opponent;
            document.wins = info.body.result === 'W' ? 1 : 0;
            document.losses = info.body.result === 'L' ? 1 : 0;
            document.kills = info.body.kills;
            document.deaths = info.body.deaths;
            document.assists = info.body.assists;
            document.save();
          });
        }
      });
      req.flash('success', 'Created a match!');
      res.redirect('/');
    }
  });
});

module.exports = router;