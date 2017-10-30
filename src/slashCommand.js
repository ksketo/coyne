// src/slashCommand.js
const commandParser = require('./commandParser')
const validateCommand = require('./validateCommand')
const helpCommand = require('./helpCommand')
const getCoinInfo = require('./getCoinInfo')
const coinr = require('coinr')
const request = require('request')
const fs = require('fs')
const postChartData = require('./createPriceChart')


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

    let text = '',
        error = validateCommand(command, coin)


    if (command == 'chart') {
        // return resolve({
        //     text,
        //     attachments: [createChartAttachment()]
        // })
        return postChartData(coin)
            .then(() => {
                resolve({
                    text: 'Coin chart',
                })
            })
            .catch(() => {
                const error = {message: "Couldn't create chart - is the coin name correct?"}
                resolve({
                    text,
                    attachments: [createErrorAttachment(error)]
                })
            })
    }

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
          .catch(() => {
              const error = {message: "Couldn't fetch information for this coin"}
              return resolve({
                  text,
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
