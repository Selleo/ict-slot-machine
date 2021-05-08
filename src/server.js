require('dotenv').config()

import express from 'express'
import getUser from './users'
import http from 'http'
import reader, { parseData } from './rfid'
import redis from 'redis'
import moment from 'moment'
// import servo from './servo'
import sendPhoto from './queue'
import Slack from './slack'
import socketIO from 'socket.io'
import takePhoto from './camera'
import slackApiRequest from './slackApiRequest'

const app = express()
const server = http.createServer(app)

const io = socketIO(server)
const redisClient = redis.createClient()
const slack = new Slack(process.env.SLACK_WEBHOOK, process.env.SLACK_LOG_WEBHOOK)
const ROLL_COOLDOWN = 14400

let readyForSpin = false
let socketClient = null
let user = null

server.listen(3000)

function _rollRequest(userId) {
  if (readyForSpin) {
    user = getUser(userId)

    if (user === undefined) {
      slack.log(userId)
      socketClient.emit('NOTIFY', 'error', 'please go to @d.holisz')
      return
    }

    redisClient.get(userId, (_, response) => {
      if (response === null) {
        redisClient.set(userId, +new Date(), 'EX', ROLL_COOLDOWN, (_, response) => {
          readyForSpin = false
          socketClient.emit('SPIN_REQUEST')
          _addSlackReminder(user)

          takePhoto(userId).then(_ => {
            // sendPhoto(user.email, userId)
          })
        })
      } else {
        socketClient.emit('NOTIFY', 'error', _generateCooldownMessage(response))
      }
    })
  }
}

function _generateCooldownMessage(rollEpoch) {
  const cooldownEpoch = parseInt(rollEpoch) + ROLL_COOLDOWN * 1000
  const duration = moment.utc(moment(cooldownEpoch).diff(+new Date()))
  const seconds = duration / 1000

  let format

  if (seconds > 3600) {
    format = 'H [hours and] m [minutes]'
  } else if (seconds > 60) {
    format = 'm [minutes]'
  } else {
    format = '[only] s [seconds] :)'
  }

  const time = duration.format(format).toString()
  return 'You need to wait ' + time + ' for the next roll!'
}

io.on('connection', client => {
  readyForSpin = true
  socketClient = client

  client.on('SPIN_ENDED', result => {
    readyForSpin = true

    if (result.win) {
      // if (result.cashPrize) servo.move()
      slack.post(user.mention, result.icon, result.cashPrize ? '5' : '2!')
    }
  })
})

const _addSlackReminder = (user) => {
  if ('string' !== typeof user.slackUserId) {
    return
  }

  slackApiRequest({
    command: 'reminders.add',
    body: {
      text: 'about using One Armed Bandit again',
      time: `in ${ROLL_COOLDOWN} seconds`,
      user: user.slackUserId
    }
  })
}

reader.on('data', data => {
  const userId = parseData(data)
  _rollRequest(userId)
})
