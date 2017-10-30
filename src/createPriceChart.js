const fs = require("fs")
const path = require("path")
const mkdir = require("mkdir-p")
const ChartjsNode = require('chartjs-node')
const Poloniex = require('poloniex-api-node')
const postSlackCommand = require('./postSlackCommand')


let poloniex = new Poloniex()
const outputDir = path.join(__dirname, "output");
mkdir.sync(outputDir);

const drawChart = (data, labels) => new Promise((resolve, reject) => {
    const chartJsOptions = {
      "type": "line",
      "data": {
          "labels": labels,
          "datasets": [{
              "label": "My First dataset",
              "data": data,
              "borderColor": "rgba(75,192,192,1)",
              "borderWidth": 1
          }]
      },
      "options": {
          "scales": {
              "yAxes": [{
                  "ticks": {
                      "beginAtZero": true
                  }
              }]
          }
      }
    }

    const chartNode = new ChartjsNode(600, 600);

    chartNode.drawChart(chartJsOptions)
        .then(streamResult => {
            const outFile = path.join(outputDir, "output_chart.png");
            resolve(chartNode.writeImageToFile('image/png', outFile));
        })
        .catch(err => {
          console.log('error found in chartNode');
          console.log(err)
          reject(err)
        })
})

const poloniexChartData = (coin, start, end) => new Promise((resolve, reject) => {
  poloniex.returnChartData(`USDT_${coin.toUpperCase()}`, 86400, start, end)
      .then((prices) => {
          data = prices.map(elem => elem.weightedAverage)
          function range(start, end) {
            return Array(end - start + 1).fill().map((_, idx) => start + idx)
          }
          const labels = range(1, data.length);
          resolve([data, labels])
      })
      .catch(console.error)
})

const postChartData = (coin) => new Promise((resolve, reject) => {
    const days = 100
    const start = Math.floor(Date.now() / 1000) - days * 86400
    const end = Math.floor(Date.now() / 1000)

    poloniexChartData(coin, start, end)
      .then((args) => {
          let data, labels;
          [data, labels] = args;
          drawChart(data, labels)
              .then(data => {
                const outFile = path.join(outputDir, "output_chart.png");
                postSlackCommand(outFile);
              })
              .catch(console.log)
      })
      .catch((err) => {
          console.log('error found in poloniex api');
          console.log(err.message)
      })
})

module.exports = postChartData;
