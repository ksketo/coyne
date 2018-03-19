const coinInfo = require('./coinInfo')
const { coinSearchForm } = require('../components/coinForm')

function _form (payload, btn, res) {
  const response = (options) => coinSearchForm(payload, options)

  return coinInfo.coinList()
    .then(data => data.map(s => {
      return {
        text: s.toUpperCase(),
        value: JSON.stringify({'coin': s.toLowerCase(), 'command': btn})
      }
    }))
    .then(options => {
      if (res) {
        return res.json(response(options))
      } else {
        return response(options)
      }
    })
    .catch(e => {
      console.error('ERROR in coinInfo: ' + e)
    })
}

// Executes when user clicks an interactive button or selects an option from the interactive menu.
function commandAction (payload) {
  const btn = payload.actions[0].value

  if (['top', 'gainers', 'losers'].includes(btn)) {
    // Returns market data result for top coins of corresponding list
    return coinInfo.getCoinInfo(btn)
  } else if (['price', 'volume', 'gains'].includes(btn)) {
    // Returns interactive input form for list of coins
    return _form(payload, btn)
  } else {
    return 'Hmm, that was unexpected. We\'re looking into it.'
  }
}

// Executes when user selects a coin from the interactive select form.
function coinAction (payload) {
  const btn = JSON.parse(payload.actions[0].selected_options[0].value)

  return coinInfo.getCoinInfo(btn.command, btn.coin)
}

module.exports = {
  commandAction,
  coinAction
}
