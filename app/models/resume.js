var mongoose = require('mongoose');

module.exports = mongoose.model('Resume', {
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    }, 
    phone: { 
        type: String,
        default: ''
    },
    technologies: { 
        type: Array,
        default: []
    },
    lang: {
        type: Array,
        default: []
    },
    resumeUrl: {
        type: String,
        default: ''
    }
});