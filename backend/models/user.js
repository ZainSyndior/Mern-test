const { model, default: mongoose } = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    Name:{type: String , required: true},
    Username:{type: String , required: true},
    Email:{type: String , required: true},
    Password:{type: String , required: true},
},
    {timestamp: true}
);

module.exports = mongoose.model('user' , userSchema , 'users');
