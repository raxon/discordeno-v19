import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

import { createRestManager } from '@discordeno/rest'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string

export const REST = createRestManager({
    token: DISCORD_TOKEN,
})
