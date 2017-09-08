var mongoose = require("mongoose");

var matchupSchema = mongoose.Schema({
    matchup: String,
    champion: String,
    opponent: String,
    createdAt: { type: Date, default: Date.now },
    username: String,
    wins: Number,
    losses: Number,
    kills: Number,
    deaths: Number,
    assists: Number,
    gameCount: Number
});

module.exports = mongoose.model("Matchup", matchupSchema);