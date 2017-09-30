const getCoinInfo = require('../src/getCoinInfo')
const emoji = require('node-emoji')


const coinJSON = {
    name: 'Ethereum',
    price_usd: '257',
    '24h_volume_usd': '1000000',
    percent_change_1h: '0.1',
    percent_change_24h: '-0.1',
    percent_change_7d: '0.01'
}

describe('Test getCoinInfo', () => {
    it('gives coin info for [price], [volume] and [gains] commands', () => {
        const gainsRes =  `Price changes of Ethereum: \n` +
                          `1h :point_up: 0.1% \n` +
                          `24h :point_down: 0.1% \n` +
                          `7d :point_up: 0.01% \n`
        expect(getCoinInfo('price', coinJSON)).toBe('Price of Ethereum is $257')
        expect(getCoinInfo('volume', coinJSON)).toBe('Volume of Ethereum the last 24h is $1m')
        expect(getCoinInfo('gains', coinJSON)).toBe(emoji.emojify(gainsRes))
    })
    it('warns user for wrong command', () => {
        expect(getCoinInfo('wrong command', coinJSON)).toBe('You probably typed a wrong command')
    })
})
