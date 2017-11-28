const emoji = require('node-emoji')
const coinr = require('coinr')
const postChartData = require('./createPriceChart')
const coinAPI = require('./coinAPI')
const {createResultAttachment, createArrayAttachment} = require('./attachments')


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

const _arraifyTop = (coinJSON) => {
  let maxNameLength = Math.max(coinJSON.reduce((a, b) => {
    return a.name.length >= b.name.length ? a : b
  }).name.length, 'COIN'.length) + 1

  let maxPriceLength = Math.max(coinJSON.reduce((a, b) => {
    return a.price_usd.length >= b.price_usd.length ? a : b
  }).price_usd.length, 'price'.length) + 1

  const lineLength = 4 + maxNameLength + 1 + 1 + maxPriceLength
  const horizontalLine = ` ${'-'.repeat(lineLength)} `

  let text = horizontalLine + '\n'
  text += `| COIN ${' '.repeat(maxNameLength - 'COIN'.length + 2)}| PRICE${' '.repeat(maxPriceLength - 'PRICE'.length)}|\n`
  text += horizontalLine + '\n'
  coinJSON.forEach((e, index) => {
    maxNameLength = index === 9 ? maxNameLength - 1 : maxNameLength
    text += `| ${index + 1}. ${e.name}${' '.repeat(maxNameLength - e.name.length)}| ${e.price_usd}${' '.repeat(maxPriceLength - e.price_usd.length)}|\n`
  })
  text += horizontalLine

  return text
}

const _arraifyGains = (coinJSON) => {
  let maxNameLength = Math.max(coinJSON.reduce((a, b) => {
    return a.name.length >= b.name.length ? a : b
  }).name.length, 'COIN'.length) + 1

  let maxGainsLength = Math.max(coinJSON.reduce((a, b) => {
    return a.percent_change_24h.length >= b.percent_change_24h.length ? a : b
  }).percent_change_24h.length, 'GAINS'.length) + 1

  const lineLength = 4 + maxNameLength + 1 + 2 + maxGainsLength
  const horizontalLine = ` ${'-'.repeat(lineLength)} `

  let text = horizontalLine + '\n'
  text += `| COIN ${' '.repeat(maxNameLength - 'COIN'.length + 2)}| PRICE${' '.repeat(maxGainsLength - 'GAINS'.length + 1)}|\n`
  text += horizontalLine + '\n'
  coinJSON.forEach((e, index) => {
    maxNameLength = index === 9 ? maxNameLength - 1 : maxNameLength
    text += `| ${index + 1}. ${e.name}${' '.repeat(maxNameLength - e.name.length)}| ${e.percent_change_24h}%${' '.repeat(maxGainsLength - e.percent_change_24h.length)}|\n`
  })
  text += horizontalLine

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
                attachments: [createArrayAttachment(title, _arraifyTop(data))]
              })
            })
            .catch(err => {
              console.error(err)
              reject(err)
            })
  } else if (command === 'gainers') {
    return coinAPI.gainers()
            .then(data => {
              const title = 'Highest 24h gainers :money_mouth_face:'

              resolve({
                text: '',
                attachments: [createArrayAttachment(title, _arraifyGains(data))]
              })
            })
            .catch(reject)
  } else if (command === 'losers') {
    return coinAPI.losers()
            .then(data => {
              const title = 'Biggest 24h losers :cold_sweat:'

              resolve({
                text: '',
                attachments: [createArrayAttachment(title, _arraifyGains(data))]
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
