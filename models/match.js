var mongoose = require("mongoose");

var matchSchema = mongoose.Schema({
    champion: String,
    opponent: String,
    kills: Number,
    deaths: Number,
    assists: Number,
    result: String,
    build: [],
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Match", matchSchema);