const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Player = mongoose.model('Player', playerSchema);