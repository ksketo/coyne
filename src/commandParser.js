// src/commandParser.js
const commandParser = (commandText) => {

  let command = /(\w{3,})/i.exec(commandText)
  let coin = /#(\w{3,})/.exec(commandText)

  if (command) command = command[0]
  if (coin) coin = coin[1]

  return {
    command,
    coin
  }
}

module.exports = commandParser
