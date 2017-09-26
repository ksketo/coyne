const validateCommand = require('../src/validateCommand')


describe('Test validateCommand', () => {
    it('returns undefined for correct input', () => {
        expect(validateCommand('price', 'eth')).toBeUndefined()
    })
    it('expects error in case of missing command', () => {
        expect(validateCommand(undefined, 'eth')).toBeInstanceOf(Error)
        expect(validateCommand(undefined, undefined)).toBeInstanceOf(Error)
    })
    it('expects error in case of wrong command', () => {
        expect(validateCommand('prices', 'eth')).toBeInstanceOf(Error)
        expect(validateCommand('prices', undefined)).toBeInstanceOf(Error)
    })
    it('expects error in case of [price], [gains], [volume] and missing coin', () => {
        expect(validateCommand('price', undefined)).toBeInstanceOf(Error)
    })
    it('expects return in case of [help]and missing coin', () => {
        expect(validateCommand('help', undefined)).toBeUndefined()
    })
    it('expects both inputs to be strings', () => {
        expect(validateCommand('gains', 'btc')).toBeUndefined()
        expect(validateCommand(['gains', 'price'], 'btc')).toBeInstanceOf(Error)
        expect(validateCommand('gains', ['eth', 'btc'])).toBeInstanceOf(Error)
    })
})
