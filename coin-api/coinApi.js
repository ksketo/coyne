const fetch = require('node-fetch')
const redis = require('redis')
const {promisify} = require('util')
const {interval} = require('../src/utils')

const COINMARKETCAP_URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=100'

const client = redis.createClient(6379, 'redis')
const setAsync = promisify(client.set).bind(client)

/* Modified fetch request the returns the body of the response. */
function fetchJSON (url) {
  return fetch(url)
    .then(res => res.json())
    .then(body => {
      if (body.Response === 'Error') throw body.Message
      return body
    })
    .catch(console.error)
}

/* Returns data for 10 top coins by market cap. */
function top (data) {
  const filteredData = data.map(e => {
    return {
      name: e.name,
      price_usd: e.price_usd,
      '24h_volume_usd': e['24h_volume_usd'],
      market_cap_usd: e.market_cap_usd
    }
  }).slice(0, 10)

  return setAsync('top', JSON.stringify(filteredData))
    .then()
    .catch(console.log)
}

/* Returns data for the 10 coins with the highest price increase for the last 24 hours. */
function gainers (data) {
  const filteredData = data
    .sort((a, b) => parseFloat(b['percent_change_24h']) - parseFloat(a['percent_change_24h']))
    .slice(0, 10)
    .map(e => {
      return {
        name: e.name,
        percent_change_24h: e['percent_change_24h']
      }
    })

  return setAsync('gainers', JSON.stringify(filteredData))
    .then()
    .catch(console.log)
}

/* Returns data for the 10 coins with the highest price drop for the last 24 hours. */
function losers (data) {
  const filteredData = data
    .sort((a, b) => parseFloat(a['percent_change_24h']) - parseFloat(b['percent_change_24h']))
    .slice(0, 10)
    .map(e => {
      return {
        name: e.name,
        percent_change_24h: e['percent_change_24h']
      }
    })

  return setAsync('losers', JSON.stringify(filteredData))
    .then()
    .catch(console.log)
}

/* Returns a set of Promises, each storing information per coin on Redis. */
function storeInfoPerCoin (data) {
  return data.map(entry => {
    return setAsync(entry.symbol, JSON.stringify(entry))
  })
}

// ************************************
// Main
// ************************************
function fetchApiData () {
  return fetchJSON(COINMARKETCAP_URL)
    .then(data => {
      Promise.all([top(data), gainers(data), losers(data)])
      return data
    }).then(data => {
      return Promise.all(storeInfoPerCoin(data))
    }).catch(e => {
      console.error('An error happened: ' + e)
    })
}

fetchApiData()
interval(fetchApiData, 5 * 60 * 1000)
