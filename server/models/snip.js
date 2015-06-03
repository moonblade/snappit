var mongoose = require('mongoose')
var validator = require('mongoose-validator')

var snipSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    note: String
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
