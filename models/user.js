var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const userModelName = "User";

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: String
});

UserSchema.pre('save', function (next) {
    var self = this;
    mongoose.models[userModelName].find({$or: [{username: self.username}, {email: self.email}]}, function (err, docs) {
        if (docs.length === 0) {
            next();
        } else {
            next(new Error("Username or email already exists!"));
        }
    });
});


module.exports = mongoose.model(userModelName, UserSchema);
