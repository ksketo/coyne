// src/validateCommandInput.js
const isString = (value) => typeof value === 'string' || !value

const validateCommand = (command, coin) => {
  if (!command) {
    return new Error('You need to define a command')
  }

  if (!['price', 'volume', 'gains', 'chart', 'help'].includes(command)) {
    return new Error("You haven't passed a correct command argument")
  }

  if (command!='help' && !coin) {
    return new Error("What's the coin you're looking for?")
  }

  if (!isString(command) || !isString(coin)) {
    return new Error("Something looks wrong")
  }

  return
}

module.exports = validateCommand
