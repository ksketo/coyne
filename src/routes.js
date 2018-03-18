const Express = require('express')
const { createMainMenu } = require('./components/mainMenu')

const router = new Express.Router()

// Executes when running /coyne. Returns interactive menu with 6 buttons (one for each command)
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const response = createMainMenu(payload.channel_id)
    return res.json(response)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Something blew up. We\'re looking into it.')
  }
})

exports.router = router
