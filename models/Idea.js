const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: Array,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('ideas', IdeaSchema)