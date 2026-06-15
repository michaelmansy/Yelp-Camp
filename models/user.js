const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// we use something from passport that has username and password thats why only included the email above
UserSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', UserSchema);