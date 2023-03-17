import { DiscordenoShard } from '@discordeno/gateway';
import { Collection, logger } from '@discordeno/utils';
import { Intents } from '@discordeno/types';
// import events from './events.js';
import express from 'express';
import fetch from 'node-fetch';

const REST_AUTHORIZATION = process.env.REST_AUTHORIZATION;


const SHARDS = new Collection<number, DiscordenoShard>()

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.all('/*', async (req, res) => {
  if (!REST_AUTHORIZATION || REST_AUTHORIZATION !== req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid authorization key.' })
  }

  try {
    // Identify A Shard
    const shardId =req.body.shardId
    switch (req.body.type) {
      case 'IDENTIFY_SHARD': {
        logger.info(`[Shard] identifying ${SHARDS.has(req.body.shardId) ? 'existing' : 'new'} shard (${shardId})`);
        const shard = SHARDS.get(req.body.shardId) ?? new DiscordenoShard({
          id: shardId,
          connection: {
            compress: req.body.compress,
            intents: req.body.intents,
            properties: req.body.properties,
            token: req.body.token,
            totalShards: req.body.totalShards,
            url: req.body.url,
            version: req.body.version,
          },
          events: {
            async message(shrd, payload) {
              await fetch(process.env.EVENT_LISTENER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: REST_AUTHORIZATION as string },
                body: JSON.stringify({ payload, shardId }),
              })
                .then((res) => res.text())
                .catch(logger.error)
            },
          },
        });

        SHARDS.set(shard.id, shard)
        await shard.identify()
        return res.status(200).json({
          identified: true,
          shardId: req.body.shardId,
          workerId: process.env.WORKER_ID,
        })
      }
      default:
        logger.error(`[Shard] Unknown request received. ${JSON.stringify(req.body)}`)
        return res.status(404).json({ message: 'Unknown request received.', status: 404 })
    }
  } catch (error: any) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.listen(process.env.SHARD_SERVER_PORT, () => {
  console.log(`Listening at ${process.env.SERVER_URL}`)
})