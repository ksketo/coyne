const MAIN_MENU_LAYOUT = {
  'response_type': 'in_channel',
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

exports.createMainMenu = (channelId) => {
  return Object.assign({
    channel: channelId
  }, MAIN_MENU_LAYOUT)
}
