import { createRestManager } from '@discordeno/rest'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string
const REST_URL = process.env.REST_HOST + ':' + process.env.REST_PORT as string
const REST_AUTHORIZATION = process.env.REST_AUTHORIZATION as string

export const REST = createRestManager({
    token: DISCORD_TOKEN,
    proxy: {
        baseUrl: REST_URL,
        authorization: REST_AUTHORIZATION,
    }
})
