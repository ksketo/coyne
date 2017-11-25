const helpCommand = require('../src/helpCommand')

describe('helpCommand', () => {
  it('returns command help for correct input', () => {
    const response = 'price #[coin-name]\n\n' +
                          'Fetches price in $ of the specified coin'
    expect(helpCommand('price')).toBe(response)
  })
  it('returns warning for wrong input', () => {
    function helpPredictions () {
      helpCommand('predictions')
    }
    expect(helpPredictions).toThrowError("You passed a command that doesn't exist")
  })
})
