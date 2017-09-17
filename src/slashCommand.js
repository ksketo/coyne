// src/slashCommand.js
const commandParser = require('./commandParser')
const validateCommand = require('./validateCommand')
const helpCommand = require('./helpCommand')
const getCoinInfo = require('./getCoinInfo')
const coinr = require('coinr')


const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const slashCommandFactory = (slackToken) => (body) => new Promise((resolve, reject) => {
  if (!body) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid body'))]
    })
  }

  if (slackToken !== body.token) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid token'))]
    })
  }

  console.log('Pass body text to command parser')
  console.log(body.text)

  // parse command and coin
  const { command, coin } = commandParser(body.text)
  console.log({ command, coin })
  console.log('command parsed')

  let text = '',
      error = validateCommand(command, coin)

  if (error) {
    console.log('Found error in validateCommand')
    console.log(error.message)
    return resolve({
      text,
      attachments: [createErrorAttachment(error)]
    })
  }

  // return value
  if (coin) {
    coinr(coin)
      .then((result) => {
        text = getCoinInfo(command, result)
        return resolve({
          text
        })
      })
  } else {
    text = helpCommand()

    return resolve({
      text
    })
  }

})

module.exports = slashCommandFactory
