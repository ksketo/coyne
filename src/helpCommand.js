const fs = require('fs')
const commands = JSON.parse(fs.readFileSync('config/commands.json', 'utf8'))

const _helpAll = () => {
  let command
  let response = []
  let index = 1

  for (let name in commands) {
    command = commands[name]
    if (!command.exclude) {
      response.push(index++ + '. ' + _helpCommand(name))
    }
  }

  return response.join('\n\n')
}

const _helpCommand = (name) => {
  try {
    const response = [ commands[name].help, commands[name].description ]
    return response.join('\n\n')
  } catch (err) {
    throw new Error("You passed a command that doesn't exist")
  }
}

module.exports = (command) => {
  let response = _helpAll()

  if (command) {
    response = _helpCommand(command)
  }

  return response
}
