const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chartSchema = new Schema({
    chartId: {
        type: String,
        unique: true,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['polar-area', 'scatter', 'bubble', 'line', 'radar', 'stacked-bar' ],
        required: true
    },
    csv: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    chartName: {
        type: String
    }
});

module.exports = mongoose.model('chart', chartSchema);