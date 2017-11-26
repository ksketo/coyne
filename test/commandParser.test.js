const commandParser = require('../src/commandParser')

describe('commandParser', () => {
  it('parses price command with coin', () => {
    expect(commandParser('price #eth')).toEqual({
      command: 'price',
      coin: 'eth'
    })
  })

  it('parses volume command with coin', () => {
    expect(commandParser('volume #eth')).toEqual({
      command: 'volume',
      coin: 'eth'
    })
  })

  it('parses gains command with coin', () => {
    expect(commandParser('gains #eth')).toEqual({
      command: 'gains',
      coin: 'eth'
    })
  })

  it('returns null for coin when missing', () => {
    expect(commandParser('help')).toEqual({
      command: 'help',
      coin: null
    })
  })

  it('returns null for coin when passed without #', () => {
    expect(commandParser('gains eth')).toEqual({
      command: 'gains',
      coin: null
    })
  })
    // add tests for when more then two words are passed
})
