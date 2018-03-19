const COIN_FORM_LAYOUT = {
  response_type: 'in_channel',
  attachments: [{
    text: 'For which coin? :slightly_smiling_face:',
    fallback: 'For which coin? :slightly_smiling_face:',
    color: '#2c963f',
    attachment_type: 'default',
    callback_id: 'coin_selection',
    actions: [{
      name: 'coins_select_menu',
      text: 'Choose a coin...',
      type: 'select'
    }]
  }]
}

exports.coinSearchForm = (payload, options) => {
  const form = Object.assign({
    'channel': payload.channel_id
  }, COIN_FORM_LAYOUT)

  form.attachments[0].actions[0].options = options

  return form
}
