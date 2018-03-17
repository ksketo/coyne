// src/server.js
const Express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
// const { createMessageAdapter } = require('@slack/interactive-messages')
// const slashCommandFactory = require('./slashCommand')
const coinInfo = require('./coinInfo')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

dotenv.load()
const {SLACK_TOKEN: slackToken, PORT} = process.env

const port = PORT || 80

// const slashCommand = slashCommandFactory(slackToken)

// // Initialize using verification token from environment variables
// const slackMessages = createMessageAdapter(process.env.SLACK_TOKEN)

// // Mount the event handler on a route
// // NOTE: you must mount to a path that matches the Request URL and/or Options URL that was configured
// app.use('/slack/actions', slackMessages.expressMiddleware())

// // Attach action handlers
// slackMessages.action('welcome_button', (payload) => {
//   // Same as above...
// })

// app.post('/', (req, res) => {
//   slashCommand(req.body)
//     .then((result) => {
//       console.log(result)
//       return res.json(result)
//     })
//     .catch(console.error)
// })

function coinInteractiveForm (slackReqObj, btn) {
  const response = (options) => {
    return {
      response_type: 'in_channel',
      channel: slackReqObj.channel_id,
      attachments: [{
        text: 'For which coin? :slightly_smiling_face:',
        fallback: 'For which coin? :slightly_smiling_face:',
        color: '#2c963f',
        attachment_type: 'default',
        callback_id: 'coin_selection',
        actions: [{
          name: 'coins_select_menu',
          text: 'Choose a coin...',
          type: 'select',
          options: options
        }]
      }]
    }
  }

  return coinInfo.coinList()
    .then(data => data.map(s => {
      return {
        text: s.toUpperCase(),
        value: JSON.stringify({'coin': s.toLowerCase(), 'command': btn})
      }
    }))
    .then(options => {
      console.log('Options returned')
      console.log(options)
      return res.json(response(options))
    })
    .catch(e => {
      console.error('An error occured')
      console.error(e)
    })
}
// ******************************************************************************
// Executes when user clicks an interactive button or selects an option from the
// interactive menu.
// Returns either:
//    A - Market/Coin data result or
//    B - Interactive input form with list of coins
// ******************************************************************************

app.post('/slack/actions', async (req, res) => {
  try {
    const slackReqObj = JSON.parse(req.body.payload)

    if (slackReqObj.callback_id === 'command_selection') {
      const btn = slackReqObj.actions[0].value

      if (['top', 'gainers', 'losers'].includes(btn)) {
        return coinInfo.getCoinInfo(btn)
          .then(result => res.json(result))
          .catch(console.error)
      } else if (['price', 'volume', 'gains'].includes(btn)) {
        return coinInteractiveForm(slackReqObj, btn)
      } else {
        return res.json('Hmm, that was unexpected. We\'re looking into it.')
      }
    } else if (slackReqObj.callback_id === 'coin_selection') {
      const btn = JSON.parse(slackReqObj.actions[0].selected_options[0].value)

      return coinInfo.getCoinInfo(btn.command, btn.coin)
        .then(result => res.json(result))
        .catch(console.error)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send('Something blew up. We\'re looking into it.')
  }
})

// ******************************************************************************
// Executes when running /coyne
// It makes post request to '/' and returns interactive menu with 6 buttons
// (one for each command)
// ******************************************************************************

app.post('/', async (req, res) => {
  try {
    const slackReqObj = req.body
    const response = {
      response_type: 'in_channel',
      channel: slackReqObj.channel_id,
      'text': 'What data would you like to get?',
      'attachments': [
        {
          'text': 'Market data (TOP 10)',
          'fallback': 'I am unable to fetch any data at the moment',
          'color': '#3AA3E3',
          'attachment_type': 'default',
          'callback_id': 'command_selection',
          'actions': [
            {
              'name': 'top',
              'text': 'Top Coins',
              'type': 'button',
              'value': 'top'
            },
            {
              'name': 'top',
              'text': 'Gainers',
              'type': 'button',
              'value': 'gainers'
            },
            {
              'name': 'top',
              'text': 'Losers',
              'type': 'button',
              'value': 'losers'
            }
          ]
        },
        {
          'text': 'Coin data',
          'color': '#947CB0',
          'attachment_type': 'default',
          'callback_id': 'command_selection',
          'actions': [
            {
              'name': 'coin',
              'text': 'Price',
              'type': 'button',
              'value': 'price'
            },
            {
              'name': 'coin',
              'text': 'Volume',
              'type': 'button',
              'value': 'volume'
            },
            {
              'name': 'coin',
              'text': 'Gains',
              'type': 'button',
              'value': 'gains'
            }
          ]
        }
      ]
    }
    return res.json(response)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Something blew up. We\'re looking into it.')
  }
})

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})

module.exports = app
