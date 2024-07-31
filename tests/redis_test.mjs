import { createClient } from 'redis'

const redisClient = createClient()

const run = async () => {
  await redisClient.connect()
  const ROLL_COOLDOWN = 60

  const response = await redisClient.get('1')

  if (response === null) {
    await redisClient.set('1', +new Date(), {
      EX: ROLL_COOLDOWN,
    })
    console.log("rolled")
  } else {
    console.log("can't roll, you have to wait")
  }
}

run()
