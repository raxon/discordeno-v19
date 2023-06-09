import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { createRestManager } from '@discordeno/rest';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string;
const REST_MANAGER_URL = (process.env.REST_MANAGER_HOST +
  ':' +
  process.env.REST_MANAGER_PORT) as string;
const SECRET_AUTHORIZATION = process.env.SECRET_AUTHORIZATION as string;

export const REST = createRestManager({
  token: DISCORD_TOKEN,
  proxy: {
    baseUrl: REST_MANAGER_URL,
    authorization: SECRET_AUTHORIZATION,
  },
});
