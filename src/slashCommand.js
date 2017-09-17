// src/slashCommand.js
const commandParser = require('./commandParser')
const helpCommand = require('./helpCommand')
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

  let text = 'invalid command'

  if (!['price', 'gains', 'volume'].includes(command)) {
    return resolve({
      text: helpCommand()
    })
  }

  // return value
  coinr(coin)
    .then((result) => {
      if (command === 'price') {
        text = `Price of ${result.name} is $${result.price_usd}`
      } else if (command === 'volume') {
        text = `Volume of ${result.name} the last 24h is $${parseInt(result['24h_volume_usd'])/1000000}m`
        console.log('print volume')
      } else if (command === 'gains') {
        text = `Price changes of ${result.name}: \n` +
                `1h ${result.percent_change_1h} \n` +
                `24h ${result.percent_change_24h} \n` +
                `7d ${result.percent_change_7d} \n`
        console.log('print gains')
      }

      return resolve({
        text: text
      })
    })
})

module.exports = slashCommandFactory
