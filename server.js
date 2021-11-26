const express = require('express')
const port = process.env.port || 3000
const bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

app.use('/emails', require('./routes/api'))

app.listen(port, function(){
    console.log('api app started')
})