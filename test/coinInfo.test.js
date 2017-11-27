const coinInfo = require('../src/coinInfo')
const emoji = require('node-emoji')

const coinJSON = {
  name: 'Ethereum',
  price_usd: '257',
  '24h_volume_usd': '1000000',
  percent_change_1h: '0.1',
  percent_change_24h: '-0.1',
  percent_change_7d: '0.01'
}

describe('coinJsonToText', () => {
  it('gives coin info for [price], [volume] and [gains] commands', () => {
    const gainsRes = `1h *:point_up: 0.1%* \n` +
                     `24h *:point_down: 0.1%* \n` +
                     `7d *:point_up: 0.01%* \n`
    expect(coinInfo.coinJsonToText('price', coinJSON))
      .toMatchObject({
        title: 'Ethereum price',
        text: 'Price of Ethereum is *$257*'
      })
    expect(coinInfo.coinJsonToText('volume', coinJSON))
      .toMatchObject({
        title: 'Ethereum volume',
        text: 'Volume of Ethereum the last 24h is *$1m*'
      })
    expect(coinInfo.coinJsonToText('gains', coinJSON))
      .toMatchObject({
        title: 'Ethereum price changes',
        text: emoji.emojify(gainsRes)
      })
  })
})

describe('getCoinInfo', () => {
  it('returns price for valid coin input', () => {
    expect.assertions(1)

    return coinInfo.getCoinInfo('price', 'eth').then(result => {
      expect(result.attachments[0].title)
        .toBe('Ethereum price')
    })
  })

  it('returns error for invalid coin', () => {
    expect.assertions(1)

    return coinInfo.getCoinInfo('price', 'nocoin').catch(error => {
      expect(error.message)
            .toEqual(expect.stringContaining("Couldn't fetch information for"))
    })
  })

  it('returns list of coins for [top] command', () => {
    expect.assertions(1)

    return coinInfo.getCoinInfo('top').then(result => {
      expect(result.attachments[0].text).toContain('1. Bitcoin')
    })
  })

  it('returns list of coins for [gainers] command', () => {
    expect.assertions(2)

    return coinInfo.getCoinInfo('gainers').then(result => {
      expect(result.attachments[0].text).toContain('1.')
      expect(result.attachments[0].text).toContain('10.')
    })
  })

  it('returns list of coins for [losers] command', () => {
    expect.assertions(2)

    return coinInfo.getCoinInfo('losers').then(result => {
      expect(result.attachments[0].text).toContain('1.')
      expect(result.attachments[0].text).toContain('10.')
    })
  })
})
