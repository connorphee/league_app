import { default as mongoose } from 'mongoose';
import { default as passportLocalMongoose } from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

/*eslint-disable */
module.exports = mongoose.model('User', UserSchema);