import { createBot, createRestManager } from '@discordeno/bot';
import dotenv from 'dotenv';
import { events } from './events/index.js';
dotenv.config({ path: '../../.env' });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string;
const REST_MANAGER_URL = (process.env.REST_MANAGER_HOST +
  ':' +
  process.env.REST_MANAGER_PORT) as string;
const SECRET_AUTHORIZATION = process.env.SECRET_AUTHORIZATION as string;

export const BOT = createBot({
  token: DISCORD_TOKEN,
  events: events,
});

BOT.rest = createRestManager({
  token: DISCORD_TOKEN,
  proxy: {
    baseUrl: REST_MANAGER_URL,
    authorization: SECRET_AUTHORIZATION,
  },
});
