// src/server.js
const Express = require('express')
const bodyParser = require('body-parser')
const slashCommandFactory = require('./slashCommand')
const dotenv = require('dotenv')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

dotenv.load()
const {SLACK_TOKEN: slackToken, PORT} = process.env

const port = PORT || 80

const slashCommand = slashCommandFactory(slackToken)

app.post('/', (req, res) => {
  slashCommand(req.body)
    .then((result) => {
      console.log(result)
      return res.json(result)
    })
    .catch(console.error)
})

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})

module.exports = app
