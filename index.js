const http = require('http')
const chalk = require('chalk')
const text = require('./data')
const { env } = require('process')

const hostname = '127.0.0.1'
const port = process.env.port || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end(chalk.yellowBright(text))
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})