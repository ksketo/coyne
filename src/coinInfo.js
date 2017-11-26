const emoji = require('node-emoji')
const coinr = require('coinr')
const postChartData = require('./createPriceChart')
const coinAPI = require('./coinAPI')


const _emojifyPrice = (price) => {
  const priceNum = parseFloat(price)
  const upDownEmj = priceNum > 0 ? ':point_up:' : ':point_down:'
  return emoji.emojify(upDownEmj + ' ' + Math.abs(priceNum))
}

const coinJsonToText = (command, coinJSON) => {
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

const _topCoinJsonToString = (coinJSON) => {
  let text = ''
  coinJSON.forEach((e, index) => {
    text += `${index + 1}. ${e.name}: $${e.price_usd} \n`
  })

  return text
}

const _percentageChangeJsonToString = (coinJSON) => {
  let text = ''
  coinJSON.forEach((e, index) => {
    text += `${index + 1}. ${e.name}: ${e.percent_change_24h} \n`
  })

  return text
}

const getCoinInfo = (command, coin) => new Promise((resolve, reject) => {
  if (command === 'chart') {
    return postChartData(coin)
            .then(() => resolve('Coin chart'))
            .catch(() => {
              const error = {message: "Couldn't create chart - is the coin name correct?"}
              reject(error)
            })
  } else if (command === 'top') {
    return coinAPI.top()
            .then(data => resolve(_topCoinJsonToString(data)))
            .catch(reject)
  } else if (command === 'gainers') {
    return coinAPI.gainers()
            .then(data => resolve(_percentageChangeJsonToString(data)))
            .catch(reject)
  } else if (command === 'losers') {
    return coinAPI.losers()
            .then(data => resolve(_percentageChangeJsonToString(data)))
            .catch(reject)
  } else {
    coinr(coin)
        .then((coinJSON) => {
          const text = coinJsonToText(command, coinJSON)
          resolve(text)
        })
        .catch(() => {
          const error = {message: "Couldn't fetch information for this coin"}
          reject(error)
        })
  }
})

module.exports = {
  coinJsonToText,
  getCoinInfo
}
