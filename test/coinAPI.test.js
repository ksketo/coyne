const coinAPI = require('../src/coinAPI')

describe('coinAPI', () => {
  describe('for top coins', () => {
    it('returns an array of objects with name and price fields', () => {
      expect.assertions(3)

      return coinAPI.top()
              .then(result => {
                expect(result.length).toBe(10)
                expect(result[0]).toHaveProperty('name')
                expect(result[0]).toHaveProperty('price_usd')
              })
    })
  })
  describe('for coins with highest percentage increase', () => {
    it('returns an array of objects with name and percentage fields', () => {
      expect.assertions(3)

      return coinAPI.gainers()
              .then(result => {
                expect(result.length).toBe(10)
                expect(result[0]).toHaveProperty('name')
                expect(result[0]).toHaveProperty('percent_change_24h')
              })
    })
  })
  describe('for coins with highest percentage loss', () => {
    it('returns an array of objects with name and percentage fields', () => {
      expect.assertions(3)

      return coinAPI.losers()
              .then(result => {
                expect(result.length).toBe(10)
                expect(result[0]).toHaveProperty('name')
                expect(result[0]).toHaveProperty('percent_change_24h')
              })
    })
  })
})
