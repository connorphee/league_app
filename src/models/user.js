import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userModelName = "User";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: String
});
 
UserSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ["email"]
});
UserSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model(userModelName, UserSchema);

export default User;
