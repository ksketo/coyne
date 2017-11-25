const postSlackCommand = require('../src/postSlackCommand')
const path = require('path')
const dotenv = require('dotenv')

dotenv.load()

describe('postSlackCommand', () => {
  it('posts successfully for valid request configuration', () => {
    expect.assertions(1)

    const outputDir = path.join(__dirname, 'test_data')
    const outFile = path.join(outputDir, 'output_chart.png')

    return postSlackCommand(outFile)
            .then(result => {
              expect(JSON.parse(result)['ok']).toBeTruthy()
            })
  })
  it('fails to make a post request for invalid file name', () => {
    expect.assertions(1)

    return postSlackCommand(' ')
            .catch(result => {
              expect(result.name).toBe('RequestError')
            })
  })
  it('fails to make a post request for invalid slack token', () => {
    expect.assertions(1)

    process.env.BOT_USER_TOKEN = ''

    return postSlackCommand(' ')
            .catch(result => {
              expect(result.name).toBe('RequestError')
            })
  })
})
