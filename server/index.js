"use strict"
var express = require('express')
var program = require('commander')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

var routes = require('./routes/index')

program
    .version('0.0.1')
    .option('-p ,--port <number>', "PORT", parseInt)
    .parse(process.argv)

var app = express()
var db = mongoose.connection

var config = require('./config').config[app.get('env')]
var PORT = program.port || process.env.PORT || 3000

mongoose.connect(config.dbHost)
db.on('error', console.error.bind(console, 'connection error : '))
db.once('open', function(callback) {
    console.log('Connected to : ' + config.dbHost)
})

app.use(bodyParser.urlencoded({
    extended: true
}))
//not loading if used
//app.use(bodyParser.json)

app.get('/', function(req, res) {
    console.log('hello')
    res.send('howdy!')
});

app.use(routes);

app.listen(PORT, function(err) {
    console.log('Listening to port : ' + PORT)
})
