import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userModelName = "User"

const UserSchema = new mongoose.Schema({
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
    firstName: {
        type: String,
        required: true,
        lowercase: false,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        lowercase: false,
        unique: false
    },
      password: String
  });

UserSchema.pre('save', function (next) {
	const self = this;
	mongoose.models[userModelName].find({$or: [{username: self.username}, {email: self.email}]}, (err, docs) => {
		if (docs.length === 0) {
            next();
        } else {
            next(new Error("Username or email already exists!"));
        }
	});
});
 
 UserSchema.plugin(passportLocalMongoose, {
     usernameQueryFields: ["email"]
 });

const User = mongoose.model(userModelName, UserSchema);

export default User;
