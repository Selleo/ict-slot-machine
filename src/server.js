import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import { createServer } from 'http'
import reader, { parseData } from './rfid.js'
import Api from './api.js'
import { createClient } from 'redis'
import moment from 'moment'
import Slack from './slack.js'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080"]
  }
})
const redisClient = createClient()

let users = await Api.getUsers();

const INTERVAL = 60 * 60 * 1000;

setInterval(async () => {
  try {
    users = await Api.getUsers();
  } catch (e) {
    console.error(e);
  }
}, INTERVAL);

const run = async () => {
  await redisClient.connect()
  const slack = new Slack(process.env.SLACK_WEBHOOK, process.env.SLACK_LOG_WEBHOOK)
  const ROLL_COOLDOWN = 14400

  let readyForSpin = false
  let socketClient = null
  let user = null

  server.listen(3000)

  Api.login();

  const rollRequest = async (userId) => {
    if (readyForSpin) {
      user = users.find((u) => u.rfid_key === userId)

      if (user === undefined) {
        slack.log(userId)
        socketClient.emit('NOTIFY', 'error', 'Your card key is not in the system. Contact @dloranc please.')
        return
      }

      const response = await redisClient.get(userId)

      if (response === null) {
        await redisClient.set(userId, +new Date(), {
          EX: ROLL_COOLDOWN,
        })
        readyForSpin = false
        socketClient.emit('SPIN_REQUEST')
      } else {
        socketClient.emit('NOTIFY', 'error', _generateCooldownMessage(response))
      }
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

    client.on('SPIN_REQUEST', () => {
      socketClient.emit('SPIN_REQUEST')
    })

    client.on('SPIN_ENDED', result => {
      readyForSpin = true

      if (result.win) {
        slack.post(user.mention, result.icon, result.cashPrize ? '5' : '2')
      }
    })
  })

  reader.on('data', data => {
    const userId = parseData(data)
    rollRequest(userId)
  })
}

run()
