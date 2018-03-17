// src/server.js
const Express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const { createMessageAdapter } = require('@slack/interactive-messages')
const { commandAction, coinAction } = require('./actions')
const { router } = require('./routes')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

dotenv.load()
const {SLACK_TOKEN: slackToken, PORT} = process.env
const port = PORT || 80

// Initialize using verification token from environment variables
const slackMessages = createMessageAdapter(slackToken)

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL and/or Options URL that was configured
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
