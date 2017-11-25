const fetch = require('node-fetch')
const Poloniex = require('poloniex-api-node')

const poloniex = new Poloniex()
const coinmarketcapUrl = 'https://api.coinmarketcap.com/v1/ticker/?start=0&limit=10'

function fetchJSON (url) {
  return fetch(url)
    .then(res => res.json())
    .then(body => {
      if (body.Response === 'Error') throw body.Message
      return body
    })
}

const top = () => new Promise((resolve, reject) => {
  return fetchJSON(coinmarketcapUrl)
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

module.exports = {
  top
}
