const postChartData = require('../src/createPriceChart')
const dotenv = require('dotenv')

dotenv.load()

describe('Test postChartData function', () => {
  it('posts successfully for valid coin input', () => {
    expect.assertions(1)

    return postChartData('eth')
            .then(result => {
              expect(JSON.parse(result)['ok']).toBeTruthy()
            })
  })
  it('fails for invalid coin', () => {
    expect.assertions(1)

    return postChartData('no-coin')
          .catch(result => {
            expect(result).toBe('Invalid currency pair.')
          })
  })
})
