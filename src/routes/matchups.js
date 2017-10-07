var express = require("express");
var router  = express.Router({mergeParams: true});
var Matchup = require('../models/matchup');
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res) {
  Matchup.find({'username': req.user.username}, function (err, matchups) {
    res.render("matchups/show",{matchups: matchups});
  })
})

module.exports = router;