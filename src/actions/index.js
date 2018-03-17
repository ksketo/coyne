const coinInfo = require('./coinInfo')

function _coinInteractiveForm (slackReqObj, btn, res) {
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
      if (res) {
        return res.json(response(options))
      } else {
        return response(options)
      }
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

function commandAction (payload) {
  const btn = payload.actions[0].value

  if (['top', 'gainers', 'losers'].includes(btn)) {
    return coinInfo.getCoinInfo(btn)
  } else if (['price', 'volume', 'gains'].includes(btn)) {
    return _coinInteractiveForm(payload, btn)
  } else {
    return 'Hmm, that was unexpected. We\'re looking into it.'
  }
}

function coinAction (payload) {
  const btn = JSON.parse(payload.actions[0].selected_options[0].value)

  return coinInfo.getCoinInfo(btn.command, btn.coin)
}

module.exports = {
  commandAction,
  coinAction
}
