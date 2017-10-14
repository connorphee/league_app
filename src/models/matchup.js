import mongoose from "mongoose";

const matchupSchema = mongoose.Schema({
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

const Matchup = mongoose.model("Matchup", matchupSchema);

export default Matchup;
