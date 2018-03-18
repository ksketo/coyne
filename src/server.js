// src/server.js
const Express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const { createMessageAdapter } = require('@slack/interactive-messages')
const { commandAction, coinAction } = require('./actions')
const { router } = require('./routes')

// Global variables
dotenv.load()
const {SLACK_TOKEN: slackToken, PORT} = process.env
const port = PORT || 80

const app = new Express()
// Middleware for Slack interactive components
const slackMessages = createMessageAdapter(slackToken)

app.use(bodyParser.urlencoded({extended: true}))

// Mount the event handler on a route
app.use('/slack/actions', slackMessages.expressMiddleware())

// Attach action handlers
slackMessages
  .action('command_selection', commandAction)
  .action('coin_selection', coinAction)

app.use(router)

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})

module.exports = app
