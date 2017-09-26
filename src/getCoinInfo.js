const getCoinInfo = (command, coinJSON) => {
  let text = 'You probably typed a wrong command'
  
  if (command === 'price') {
    text = `Price of ${coinJSON.name} is $${coinJSON.price_usd}`
  } else if (command === 'volume') {
    text = `Volume of ${coinJSON.name} the last 24h is $${parseInt(coinJSON['24h_volume_usd'])/1000000}m`
  } else if (command === 'gains') {
    text = `Price changes of ${coinJSON.name}: \n` +
            `1h ${coinJSON.percent_change_1h} \n` +
            `24h ${coinJSON.percent_change_24h} \n` +
            `7d ${coinJSON.percent_change_7d} \n`
  }

  return text
}

module.exports = getCoinInfo
