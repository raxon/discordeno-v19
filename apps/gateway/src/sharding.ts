import { DiscordenoShard } from '@discordeno/gateway';
import { Collection, logger } from '@discordeno/utils';
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
dotenv.config();

const SHARDS = new Collection<number, DiscordenoShard>()
const REST_AUTHORIZATION = process.env.REST_AUTHORIZATION as string

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

function getUrlFromShardId(totalShards: number, shardId: number) {
 const urls = process.env.EVENT_HANDLER_URLS?.split(',') ?? [];
 const index = totalShards % shardId;

 return urls[index] ?? urls[0];
}

app.all('/*', async (req, res) => {
  if (!REST_AUTHORIZATION || REST_AUTHORIZATION !== req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid authorization key.' })
  }

  try {
    // Identify A Shard
    switch (req.body.type) {
      case 'IDENTIFY_SHARD': {
        logger.info(`[Shard] identifying ${SHARDS.has(req.body.shardId) ? 'existing' : 'new'} shard (${req.body.shardId})`);
        const shard = SHARDS.get(req.body.shardId) ?? new DiscordenoShard({
          id: req.body.shardId,
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
            async message(shard, payload) {
              await fetch(getUrlFromShardId(req.body.totalShards, shard.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: REST_AUTHORIZATION },
                body: JSON.stringify({ payload, shardId:req.body.shardId }),
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