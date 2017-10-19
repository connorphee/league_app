import express from 'express';
const router  = express.Router({mergeParams: true});
import Match from '../models/match';
import Matchup from '../models/matchup';
import middleware from '../middleware';
import fetch from 'node-fetch';

router.get('/new', middleware.isLoggedIn, (req, res) => {
   res.render('matches/new');
});

router.get("/", middleware.isLoggedIn, (req, res) => {
  Match.find({ "author.username": req.user.username }, (err, matches) => {
    res.render("matches/show", { matches });
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Match.create(req.body.match, (err, match) => {
    if (err) {
      // Add logging
    } else {
      const info = req;
      const matchup =
        info.body.champion.toUpperCase() +
        "V" +
        info.body.opponent.toUpperCase();
      const username = info.user.username;
      match = buildMatchObject(match, info);
      match.save();
      updateMatchup(username, matchup, info);

      req.flash("success", "Created a match!");
      res.redirect("/");
    }
  });
});

// GET ALL GAME MATCHES FROM ONE ACCOUNT
router.post('/id', middleware.isLoggedIn, (req, res) => {
  var items = {};
  var teams = {};
  var match_arr = [];
  var hero_sel={};
  var outcome = {};
  var players = {};
  //First get all champs and items from public site hosted as .json file
  fetch ('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json')
  .then((response)=>{return response.json(); })
  .then((data)=>{
    // console.log(data);
    for(var key in data){
      items[key] = data[key].name;
    }
    console.log(items);
  })
  fetch( "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json")
  .then((response)=> { return response.json(); })
  .then((data)=> {
    var champs = data.data
    for (var champ in champs){
      var champion = champs[champ]
      //Set as object to take advantage of key accessor
      hero_sel[champion.key]= champs[champ].name;
    }
  })
  .catch(function () {
     console.log("Promise Rejected");
    });

  fetch(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.body.name}?api_key=${process.env.RIOT_KEY}`,
    { method: 'GET'})
  .then((res)=>{
    return res.json();
  }).then(function(json) {
    return json.accountId;
  })
  .then((id)=>{
    fetch(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${id}/recent?api_key=${process.env.RIOT_KEY}`,{method:'GET'})
    .then((matches)=>{
      return matches.json();
    })
    .then((data) =>{
      data.matches.map((match)=>{
        // Comment out line below, and line above with associated brackets to test one match at a time
        // var match = data.matches[0];
        fetch(`https://na1.api.riotgames.com/lol/match/v3/matches/${match.gameId}?api_key=${process.env.RIOT_KEY}`,{method:'GET'})
        .then((match_data)=>{
          return(match_data.json());
        })
        .then((final)=>{
          final.teams.map((winner)=>{
            outcome[winner.teamId] = {};
            outcome[winner.teamId] = winner.win;
          })
          final.participantIdentities.map((user)=>{
            players[user.participantId] = user.player.summonerName
          })
          final.participants.map((user_stats)=>{
            var stats = user_stats.stats;
            if(!teams[user_stats.teamId]){
              teams[user_stats.teamId] = [];
            }
            teams[user_stats.teamId].push(
              {
                "summonerNme": players[user_stats.participantId],
                "champion": hero_sel[user_stats.championId],
                "stats":{
                  kills: stats.kills,
                  deaths: stats.deaths,
                  assists: stats.assists,
                  build:
                    [
                      items[stats.item0],
                      items[stats.item1],
                      items[stats.item2],
                      items[stats.item3],
                      items[stats.item4],
                      items[stats.item5],
                      items[stats.item6]
                      ],
                "win": outcome[user_stats.teamId],
                }
              })
            }
          );
          match_arr.push(teams);
          teams = {}
          // console.log(match_arr[0]['100']);
          return match_arr
        })
      });
    });
  })
  .then((matches)=>{
    res.render("matches/show", { matches });
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
  match.build = values.body.build.split(",");
  match.result = values.body.result;

  return match;
}

function buildMatchupObject(matchup, values) {
  matchup.gameCount = 1;
  matchup.username = values.user.username;
  matchup.champion = values.body.champion;
  matchup.opponent = values.body.opponent;
  matchup.wins = values.body.result === "W" ? 1 : 0;
  matchup.losses = values.body.result === "L" ? 1 : 0;
  matchup.kills = values.body.kills;
  matchup.deaths = values.body.deaths;
  matchup.assists = values.body.assists;

  return matchup;
}

function updateMatchup(username, matchup, values) {
  Matchup.findOne({ matchup, username }, (err, document) => {
    if (document) {
      document.gameCount++;
      values.body.result === "W" ? document.wins++ : document.losses++;
      document.kills += parseInt(values.body.kills);
      document.deaths += parseInt(values.body.deaths);
      document.assists += parseInt(values.body.assists);
      document.save();
    } else {
      Matchup.create({ name: "hello" }, (err, document) => {
        if (err) throw err;
        buildMatchupObject(document, values);
        document.matchup = matchup;
        document.save();
      });
    }
  });
}

export default router;
