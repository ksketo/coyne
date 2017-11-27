// src/slashCommand.js
const commandParser = require('./commandParser')
const validateCommand = require('./validateCommand')
const helpCommand = require('./helpCommand')
const coinInfo = require('./coinInfo')
const {createErrorAttachment, createHelpAttachment} = require('./attachments')


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

  // parse command and coin
  const { command, coin } = commandParser(body.text)
  console.log({ command, coin })

  let text = ''
  let error = validateCommand(command, coin)

  if (error) {
    return resolve({
      text,
      attachments: [createErrorAttachment(error)]
    })
  }

  // return value
  if (coin || ['top', 'gainers', 'losers'].includes(command)) {
    return coinInfo.getCoinInfo(command, coin)
        .then(resolve)
        .catch(() => {
          error = {
            message: 'Are you sure this is the coin you are looking for?'
          }

          return resolve({
            text: '',
            attachments: [createErrorAttachment(error)]
          })
        })
  } else {
    text = helpCommand()

    return resolve({
      text: '',
      attachments: [createHelpAttachment(text)]
    })
  }
})

module.exports = slashCommandFactory
