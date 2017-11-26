const fetch = require('node-fetch')
const Poloniex = require('poloniex-api-node')

const poloniex = new Poloniex()
const coinmarketcapUrlTop = 'https://api.coinmarketcap.com/v1/ticker/?start=0&limit=10'
const coinmarketcapUrl = 'https://api.coinmarketcap.com/v1/ticker/?limit=100'

function fetchJSON (url) {
  return fetch(url)
    .then(res => res.json())
    .then(body => {
      if (body.Response === 'Error') throw body.Message
      return body
    })
}

const top = () => new Promise((resolve, reject) => {
  return fetchJSON(coinmarketcapUrlTop)
    .then(data => {
      const filteredData = data.map(e => {
        return {
          name: e.name,
          price_usd: e.price_usd,
          '24h_volume_usd': e['24h_volume_usd'],
          market_cap_usd: e.market_cap_usd,
        }
      })
      resolve(filteredData)
    })
    .catch(reject)
})

const gainers = () => new Promise((resolve, reject) => {
  return fetchJSON(coinmarketcapUrl)
    .then(data => {
      const filteredData = data
        .sort((a, b) => parseFloat(b['percent_change_24h']) - parseFloat(a['percent_change_24h']))
        .slice(0, 10)
        .map(e => {
          return {
            name: e.name,
            percent_change_24h: e['percent_change_24h']
          }
        })
      resolve(filteredData)
    })
    .catch(reject)
})

const losers = () => new Promise((resolve, reject) => {
  return fetchJSON(coinmarketcapUrl)
    .then(data => {
      const filteredData = data
        .sort((a, b) => parseFloat(a['percent_change_24h']) - parseFloat(b['percent_change_24h']))
        .slice(0, 10)
        .map(e => {
          return {
            name: e.name,
            percent_change_24h: e['percent_change_24h']
          }
        })
      resolve(filteredData)
    })
    .catch(reject)
})

module.exports = {
  top,
  gainers,
  losers
}
