import SlackWebhook from 'slack-webhook'
import { join, times } from 'lodash-es'

export default class Slack {
  constructor(webhook, logWebhook) {
    this.slack = new SlackWebhook(webhook)
    this.logSlack = new SlackWebhook(logWebhook)
  }

  post(winner, icon, reward) {
    const result = join(times(3, () => `:slot_${icon}:`), '')

    this.slack.send({
      text: `<@${winner}> just got ${result} and won ${reward} kudos!`,
      username: 'Slot Machine'
    })
  }

  log(message) {
    this.logSlack.send({
      text: message
    })
  }
}
