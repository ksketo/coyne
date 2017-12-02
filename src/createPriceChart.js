const path = require('path')
const mkdir = require('mkdir-p')
const ChartjsNode = require('chartjs-node')
const Poloniex = require('poloniex-api-node')
const postSlackCommand = require('./postSlackCommand')
const chartJsOptions = require('../config/chartjs')
const {mod, range} = require('./utils')

let poloniex = new Poloniex()
const outputDir = path.join(__dirname, 'output')
mkdir.sync(outputDir)

const months = [
  'Jan',
  'Feb',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

const _indexToMonth = (currentMonth, currentDay, end) => range(1, end).map(n => {
  let tMonth = currentMonth
  if (currentDay === 1) {
    currentMonth = mod(currentMonth - 1, 12)
    currentDay = 30
  } else {
    currentDay -= 1
  }
  return months[tMonth]
}).reverse()

const drawChart = (data, labels, coin) => new Promise((resolve, reject) => {
  const chartNode = new ChartjsNode(600, 300)

  chartNode.drawChart(chartJsOptions(data, labels, coin))
        .then(streamResult => {
          const outFile = path.join(outputDir, 'output_chart.png')
          resolve(chartNode.writeImageToFile('image/png', outFile))
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
})

const poloniexChartData = (coin, start, end) => new Promise((resolve, reject) => {
  return poloniex.returnChartData(`USDT_${coin.toUpperCase()}`, 86400, start, end)
      .then((prices) => {
        const data = prices.map(elem => elem.weightedAverage)
        const d = new Date()
        let currentDay = d.getDate()
        let currentMonth = d.getMonth()
        const labels = _indexToMonth(currentMonth, currentDay, 100)
        resolve([data, labels])
      })
      .catch(reject)
})

const postChartData = (coin) => new Promise((resolve, reject) => {
  const days = 100
  const start = Math.floor(Date.now() / 1000) - days * 86400
  const end = Math.floor(Date.now() / 1000)

  return poloniexChartData(coin, start, end)
      .then((args) => {
        let data, labels;
        [data, labels] = args
        return drawChart(data, labels, coin)
              .then(data => {
                const outFile = path.join(outputDir, 'output_chart.png')
                return postSlackCommand(outFile)
                    .then(resolve)
                    .catch(reject)
              })
              .catch(err => {
                console.log(err)
                reject(err)
              })
      })
      .catch((err) => {
        console.log('error found in poloniex api')
        console.log(err.message)
        reject(err.message)
      })
})

module.exports = postChartData
