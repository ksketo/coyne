const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const createHelpAttachment = (text) => ({
  text: "```\n" + `${text}` + "```\n",
  mrkdwn_in: ['text']
})

const createResultAttachment = (title, text) => ({
  color: '#36a64f',
  title: `${title}`,
  text: `${text}`,
  mrkdwn_in: ['text']
})

module.exports = {
  createErrorAttachment,
  createHelpAttachment,
  createResultAttachment
}
