import axios from 'axios'

export default function slackApiRequest(options = {}) {
  const {
    command,
    body
  } = options

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${process.env.SLACK_COMMAND_TOKEN}`
    }
  }

  return axios.post(
    `https://slack.com/api/${command}`,
    body,
    requestOptions
  )
}
