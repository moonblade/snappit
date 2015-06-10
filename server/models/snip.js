var mongoose = require('mongoose')
var validator = require('mongoose-validator')

var snipSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    note: String,
    urls: [{
        label: String,
        link: String,
        _id: false,
        id: false
    }],
    modified: {
        type: String,
        required: true
    },
    lock: {
        lockType: {
            type: Number,
            default: 0
        },
        password: String
    }
})

snipSchema.index({
    url: true
}, {
    unique: true
})

snipSchema.statics.findByUrl = function(url, cb) {
    this.findOne({
        url: url
    }, cb)
}

var snip = mongoose.model('snip', snipSchema)
module.exports = snip
