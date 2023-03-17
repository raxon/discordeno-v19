import { createGatewayManager } from '@discordeno/gateway'
import { Intents } from '@discordeno/types'
import { logger } from '@discordeno/utils'
import { REST } from './rest.js'

export const GATEWAY = createGatewayManager({
    token: process.env.TOKEN,
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
    if (!url) return logger.error(`No server URL found for server #${workerId}. Unable to start Shard #${shardId}`)

    await fetch(url, {
        method: 'POST',
        headers: {
            authorization: process.env.AUTHORIZATION,
        },
        body: JSON.stringify({ type: 'IDENTIFY_SHARD', shardId }),
    })
        .then((res) => res.json())
        .catch(logger.error)
}