const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    expressionLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    expressionNumber: {
        type: String,
        enum : ['10', '20', '30'], 
        default :'10'
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
