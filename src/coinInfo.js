const emoji = require('node-emoji')
const redis = require('redis')
const {promisify} = require('util')
const {createResultAttachment, createArrayAttachment} = require('./attachments')

const client = redis.createClient(6379, 'redis')
const getAsync = promisify(client.get).bind(client)

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
    text = `1h *${_emojifyPrice(coinJSON.percent_change_1h)}%* \n` +
           `24h *${_emojifyPrice(coinJSON.percent_change_24h)}%* \n` +
           `7d *${_emojifyPrice(coinJSON.percent_change_7d)}%* \n`
    title = `${coinJSON.name} price changes`
  }

  return {title, text}
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

const getCoinInfo = (command, coin) => {
  if (command === 'top') {
    return getAsync('top')
      .then(data => JSON.parse(data))
      .then(data => {
        const title = 'Top coins by market cap :money_mouth_face:'
        return {
          text: '',
          attachments: [createArrayAttachment(title, _arraifyTop(data))]
        }
      })
  } else if (command === 'gainers') {
    return getAsync('gainers')
      .then(data => JSON.parse(data))
      .then(data => {
        const title = 'Highest 24h gainers :money_mouth_face:'
        return {
          text: '',
          attachments: [createArrayAttachment(title, _arraifyGains(data))]
        }
      })
  } else if (command === 'losers') {
    return getAsync('losers')
      .then(data => JSON.parse(data))
      .then(data => {
        const title = 'Biggest 24h losers :cold_sweat:'
        return {
          text: '',
          attachments: [createArrayAttachment(title, _arraifyGains(data))]
        }
      })
  } else {
    return getAsync(coin.toUpperCase())
      .then(data => JSON.parse(data))
      .then((coinJSON) => {
        const {title, text} = coinJsonToText(command, coinJSON)
        return {
          text: '',
          attachments: [createResultAttachment(title, text)]
        }
      })
  }
}

module.exports = {
  coinJsonToText,
  getCoinInfo
}
