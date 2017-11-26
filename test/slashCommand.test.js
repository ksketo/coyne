const slashCommandFactory = require('../src/slashCommand')

const slackToken = '1234'
const slashCommand = slashCommandFactory(slackToken)
const body = {
  token: '1234',
  text: 'price #eth'
}

describe('slashCommand', () => {
  it('returns error attachement for empty body', () => {
    return slashCommand(undefined).then(result => {
      expect(result.text).toBe('')
      expect(result.attachments[0].text)
                .toEqual(expect.stringContaining('Invalid body'))
    })
  })

  it('fails when called with slack token different from body', () => {
    body.token = '12'
    return slashCommand(body).then(result => {
      expect(result.text).toBe('')
      expect(result.attachments[0].text)
                .toEqual(expect.stringContaining('Invalid token'))
    })
  })

  it('fails when body.text is invalid', () => {
    body.text = 'prices'
    body.token = '1234'
    return slashCommand(body).then(result => {
      expect(result.text).toBe('')
      expect(result.attachments[0].text)
                .toEqual(expect.stringContaining("You haven't passed a correct command argument"))
    })
  })

  it('fails for non-existing coin', () => {
    body.text = 'price #adtok'
    return slashCommand(body).then(result => {
      expect(result.text).toContain('1.')
    })
  })

  it('shows help for valid command and no coin', () => {
    body.text = 'help'
    return slashCommand(body).then(result => {
      expect(result.text).toContain('1.')
    })
  })

  it('works for [price #eth]', () => {
    body.text = 'price #eth'
    return slashCommand(body).then(result => {
      expect(result.text).toContain('Price of Ethereum is')
    })
  })

  it('shows help for weird input - invalid command', () => {
    console.log('to do')
  })

  // describe('when chart command is run', () => {
  //   it('returns price chart for valid coin input', () => {
  //     expect.assertions(2)
  //
  //     body.text = 'chart #eth'
  //     return slashCommand(body).then(result => {
  //       expect(result.text).toBe('Coin chart')
  //       expect(result.attachments).toBeUndefined()
  //     })
  //   })
  //
  //   it('creates error attachment for invalid coin', () => {
  //     expect.assertions(1)
  //
  //     body.text = 'chart #nocoin'
  //     return slashCommand(body).then(result => {
  //       expect(result.attachments[0].text)
  //             .toEqual(expect.stringContaining("Couldn't create chart"))
  //     })
  //   })
  // })
})
