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
})
