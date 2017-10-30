const fs = require('fs')
const rp = require('request-promise')


const postSlackCommand = (outfile) => {
    const options = {
        method: 'POST',
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: process.env.BOT_USER_TOKEN,
            title: "Image",
            filename: "image.png",
            filetype: "auto",
            channels: 'general',
            file: fs.createReadStream(outfile),
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        }
    }

    return rp(options)
        .then(function (body) {
            console.log('post succeeded')
            console.log(body)
        })
        .catch(function (err) {
            console.log('post failed')
            console.log(err)
        })
}

module.exports = postSlackCommand
