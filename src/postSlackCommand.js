const fs = require('fs')
const rp = require('request-promise')

const postSlackCommand = (outfile) => new Promise((resolve, reject) => {
  const options = {
    method: 'POST',
    url: 'https://slack.com/api/files.upload',
    formData: {
      token: process.env.BOT_USER_TOKEN,
      title: 'Image',
      filename: 'image.png',
      filetype: 'auto',
      channels: 'general',
      file: fs.createReadStream(outfile)
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  return rp(options)
        .then(function (body) {
          console.log('post succeeded')
          resolve(body)
        })
        .catch(function (err) {
          console.log('post failed')
          reject(err)
        })
})

module.exports = postSlackCommand
