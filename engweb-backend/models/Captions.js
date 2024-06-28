const mongoose = require('mongoose');

const captionSchema = mongoose.Schema({
    videoId: {
        type: String,
        required: true,
    },
    captionId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Caption = mongoose.model('Caption', captionSchema);

module.exports = Caption;
