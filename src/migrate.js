import redis from 'redis'
import { USERS } from './users'

const client = redis.createClient()

for (const id of Object.keys(USERS)) {
  client.hset(`${id}_user`, 'email', USERS[id].email, 'mention', USERS[id].mention, () => {
    console.log(id)
  })
}
