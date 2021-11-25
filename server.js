var express = require('express')
var app = express()

const port = process.env.port || 3000

app.get('/', function(req, res){
    res.send('Hello API!')
})

app.listen(port, function(){
    console.log('api app started')
})