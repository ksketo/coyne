// src/slashCommand.js
const commandParser = require('./commandParser')
const validateCommand = require('./validateCommand')
const helpCommand = require('./helpCommand')
const coinInfo = require('./coinInfo')

const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const createChartAttachment = () => ({
  color: '#36a64f',
  text: `Chart`,
  image_url: 'http://angularscript.com/wp-content/uploads/2014/11/angular-chart.js-Line-Chart.jpg'
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

  let text = ''
  let error = validateCommand(command, coin)

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
    return coinInfo.getCoinInfo(command, coin)
        .then(text => {
          resolve({
            text: text
          })
        })
        .catch(error => {
          resolve({
            text: '',
            attachments: [createErrorAttachment(error)]
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
