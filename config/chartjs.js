chartJsOptions = (data, labels, coin) => {
  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        radius: 0,
        label: {
          display: 'Price history'
        },
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label (tooltipItem) {
            console.log(tooltipItem)
            return tooltipItem.yLabel
          }
        }
      },
      title: {
        display: true,
        text: `${coin.toUpperCase()} price history (100d)`
      },
      scales: {
        yAxes: [{
          ticks: {
            'beginAtZero': false
          },
          gridLines: {
            display: false
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            callback: function (dataLabel, index) {
              return index % 30 === 0 ? dataLabel : ''
            }
          }
        }]
      }
    }
  }
}

module.exports = chartJsOptions
