const emoji = require('node-emoji')

const _emojifyPrice = (price) => {
  const priceNum = parseFloat(price)
  const upDownEmj = priceNum > 0 ? ':point_up:' : ':point_down:'
  return emoji.emojify(upDownEmj + ' ' + Math.abs(priceNum))
}

const getCoinInfo = (command, coinJSON) => {
  let text = 'You probably typed a wrong command'

  if (command === 'price') {
    text = `Price of ${coinJSON.name} is $${coinJSON.price_usd}`
  } else if (command === 'volume') {
    text = `Volume of ${coinJSON.name} the last 24h is $${parseInt(coinJSON['24h_volume_usd']) / 1000000}m`
  } else if (command === 'gains') {
    text = `Price changes of ${coinJSON.name}: \n` +
            `1h ${_emojifyPrice(coinJSON.percent_change_1h)}% \n` +
            `24h ${_emojifyPrice(coinJSON.percent_change_24h)}% \n` +
            `7d ${_emojifyPrice(coinJSON.percent_change_7d)}% \n`
  }

  return text
}

module.exports = getCoinInfo
