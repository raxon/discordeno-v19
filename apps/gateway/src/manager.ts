import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

import { createGatewayManager } from '@discordeno/gateway'
import { logger } from '@discordeno/utils'
import { REST } from './rest.js'
import fetch from 'node-fetch'
import { Intents } from '@discordeno/types'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string
const REST_AUTHORIZATION = process.env.REST_AUTHORIZATION as string




export const GATEWAY = createGatewayManager({
    token: DISCORD_TOKEN,
    intents: Intents.Guilds | Intents.GuildMessages,
    shardsPerWorker: 500,
    totalWorkers: 10,
    events: {
        hello: () => {
            logger.info(`[READY] Shard hello!`)
        },
    },
    connection: await REST.getSessionInfo(),
})


GATEWAY.tellWorkerToIdentify = async function (workerId, shardId, bucketId) {
    const url = process.env[`SERVER_URL_${workerId}`]
    console.log("worker url:",url)
    if (!url) return logger.error(`No server URL found for server #${workerId}. Unable to start Shard #${shardId}`)

    await fetch(url, {
        method: 'POST',
        headers: {
            authorization: REST_AUTHORIZATION,
        },
        body: JSON.stringify({ type: 'IDENTIFY_SHARD', shardId }),
    })
        .then((res) => res.json())
        .catch(logger.error)
}

