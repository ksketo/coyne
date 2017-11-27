const emoji = require('node-emoji')
const coinr = require('coinr')
const postChartData = require('./createPriceChart')
const coinAPI = require('./coinAPI')
const {createResultAttachment} = require('./attachments')


const _emojifyPrice = (price) => {
  const priceNum = parseFloat(price)
  const upDownEmj = priceNum > 0 ? ':point_up:' : ':point_down:'
  return emoji.emojify(upDownEmj + ' ' + Math.abs(priceNum))
}

const coinJsonToText = (command, coinJSON) => {
  let text = 'You probably typed a wrong command'
  let title = ''

  if (command === 'price') {
    text = `Price of ${coinJSON.name} is *$${coinJSON.price_usd}*`
    title = `${coinJSON.name} ${command}`
  } else if (command === 'volume') {
    text = `Volume of ${coinJSON.name} the last 24h is *$${parseInt(coinJSON['24h_volume_usd']) / 1000000}m*`
    title = `${coinJSON.name} ${command}`
  } else if (command === 'gains') {
    text =  `1h *${_emojifyPrice(coinJSON.percent_change_1h)}%* \n` +
            `24h *${_emojifyPrice(coinJSON.percent_change_24h)}%* \n` +
            `7d *${_emojifyPrice(coinJSON.percent_change_7d)}%* \n`
    title = `${coinJSON.name} price changes`
  }

  return {title, text}
}

const _topCoinJsonToString = (coinJSON) => {
  let text = ''
  coinJSON.forEach((e, index) => {
    text += `${index + 1}. ${e.name}: *$${e.price_usd}* \n`
  })

  return text
}

const _percentageChangeJsonToString = (coinJSON) => {
  let text = ''
  coinJSON.forEach((e, index) => {
    text += `${index + 1}. ${e.name}: *${e.percent_change_24h}%* \n`
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
            .then(data => {
              const title = 'Top coins by market cap :money_mouth_face:'
              resolve({
                text: '',
                attachments: [createResultAttachment(title, _topCoinJsonToString(data))]
              })
            })
            .catch(reject)
  } else if (command === 'gainers') {
    return coinAPI.gainers()
            .then(data => {
              const title = 'Highest 24h gainers :money_mouth_face:'

              resolve({
                text: '',
                attachments: [createResultAttachment(title, _percentageChangeJsonToString(data))]
              })
            })
            .catch(reject)
  } else if (command === 'losers') {
    return coinAPI.losers()
            .then(data => {
              const title = 'Biggest 24h losers :cold_sweat:'

              resolve({
                text: '',
                attachments: [createResultAttachment(title, _percentageChangeJsonToString(data))]
              })
            })
            .catch(reject)
  } else {
    coinr(coin)
        .then((coinJSON) => {
          const {title, text} = coinJsonToText(command, coinJSON)
          resolve({
            text: '',
            attachments: [createResultAttachment(title, text)]
          })
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
