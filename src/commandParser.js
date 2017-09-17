// src/commandParser.js
const tokenizer = require('string-tokenizer')


const commandParser = (commandText) => {
  const tokens = tokenizer()
    .input(commandText)
    .token('command', /(\w{3,})\ /)
    .token('coin', /#(\w{3,})/)
    .resolve()

  return {
    command: tokens.command,
    coin: tokens.coin
  }
}

module.exports = commandParser
