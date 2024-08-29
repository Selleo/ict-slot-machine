import Slack from '../src/slack.js'

const slack = new Slack(process.env.SLACK_LOG_WEBHOOK, process.env.SLACK_LOG_WEBHOOK)

slack.log('<@UML5E8YBD> mention')
