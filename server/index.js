"use strict"
var express = require('express')
var program = require('commander')

program
	.version('0.0.1')
	.option('-p ,--port <number>',"PORT",parseInt)
	.parse(process.argv)

var app = express()
var PORT = program.port || process.env.PORT || 3000

app.get('/',function(req,res){
	console.log('hello')
	res.send('howdy!')
});


app.listen(PORT,function(err){
	console.log('Listening to port : '+PORT)
})