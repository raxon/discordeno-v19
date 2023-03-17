import { logger } from '@discordeno/utils';
import dotenv from 'dotenv';
import express from 'express';
import { GATEWAY } from './manager.js';
dotenv.config({ path: '../../.env' });
import './sharding.js';

const GATEWAY_MANAGER_HOST = process.env.GATEWAY_MANAGER_HOST;
const GATEWAY_MANAGER_PORT = process.env.GATEWAY_MANAGER_PORT;
const SECRET_AUTHORIZATION = process.env.SECRET_AUTHORIZATION;

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.all('/*', async (req, res) => {
  if (
    !SECRET_AUTHORIZATION ||
    SECRET_AUTHORIZATION !== req.headers.authorization
  ) {
    return res.status(401).json({ error: 'Invalid authorization key.' });
  }

  try {
    // Identify A Shard
    switch (req.body.type) {
      case 'REQUEST_MEMBERS': {
        return await GATEWAY.requestMembers(req.body.guildId, req.body.options);
      }
      default:
        logger.error(
          `[Shard] Unknown request received. ${JSON.stringify(req.body)}`
        );
        return res
          .status(404)
          .json({ message: 'Unknown request received.', status: 404 });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen(process.env.GATEWAY_MANAGER_PORT, () => {
  console.log(
    `Listening [GATEWAY]: ${GATEWAY_MANAGER_HOST}:${GATEWAY_MANAGER_PORT}`
  );
});
