import * as dotenv from 'dotenv'
import { createRestManager } from '@discordeno/rest'
dotenv.config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string

export const REST = createRestManager({
    token: DISCORD_TOKEN,
})
