import { DiscordGatewayPayload } from '@discordeno/types';
import { logger, snakeToCamelCase } from '@discordeno/utils';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config({ path: '../../.env' });

import { BOT } from './bot.js';

const SECRET_AUTHORIZATION = process.env.SECRET_AUTHORIZATION as string;
const BOT_HOST = process.env.BOT_HOST as string;
const BOT_PORT = process.env.BOT_PORT as string;

BOT.logger.info(`[run] Bot works.`);

process
  .on('unhandledRejection', (error) => {
    // if (!BUGS_ERRORS_REPORT_WEBHOOK) return;
    // const { id, token } = webhookURLToIDAndToken(BUGS_ERRORS_REPORT_WEBHOOK);
    // if (!id || !token) return;

    // DO NOT SEND ERRORS FROM NON PRODUCTION
    // if (BOT_ID !== 270010330782892032n) {
    // 	return console.error(error);
    // }

    // An unhandled error occurred on the bot in production
    console.error(
      error ??
        `An unhandled rejection error occurred but error was null or undefined`
    );

    if (!error) return;

    // ReferenceError: publishMessage is not defined
    /*
    const embeds = new Embeds()
      .setDescription(["```js", error, "```"].join(`\n`))
      .setTimestamp()
      .setFooter("Unhandled Rejection Error Occurred");

    // SEND ERROR TO THE LOG CHANNEL ON THE DEV SERVER
    return bot.helpers.sendWebhookMessage(bot.transformers.snowflake(id), token, { embeds }).catch(console.error);
    */
  })
  .on('uncaughtException', async (error) => {
    // if (!BUGS_ERRORS_REPORT_WEBHOOK) return;
    // const { id, token } = webhookURLToIDAndToken(BUGS_ERRORS_REPORT_WEBHOOK);
    // if (!id || !token) return;

    // // DO NOT SEND ERRORS FROM NON PRODUCTION
    // if (BOT_ID !== 270010330782892032n) {
    // 	return console.error(error);
    // }

    // An unhandled error occurred on the bot in production
    console.error(
      error ?? `An unhandled exception occurred but error was null or undefined`
    );

    if (!error) process.exit(1);

    /*
    const embeds = new Embeds()
      .setDescription(["```js", error.stack, "```"].join(`\n`))
      .setTimestamp()
      .setFooter("Unhandled Exception Error Occurred");
      // SEND ERROR TO THE LOG CHANNEL ON THE DEV SERVER
      await bot.helpers.sendWebhookMessage(bot.transformers.snowflake(id), token, { embeds }).catch(console.error);
      */

    process.exit(1);
  });

if (process.env.DEVELOPMENT === 'true') {
  logger.info(`[DEV MODE] Updating slash commands for dev server.`);
  // updateDevCommands(bot);
}

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.all('/', async (req, res) => {
  try {
    if (
      !SECRET_AUTHORIZATION ||
      SECRET_AUTHORIZATION !== req.headers.authorization
    ) {
      return res.status(401).json({ error: 'Invalid authorization key.' });
    }

    const json = req.body as {
      message: DiscordGatewayPayload;
      shardId: number;
    };

    // if (json.message.t) BOT.events.raw[snakeToCamelCase(json.message.t)]?.(req.body.payload, req.body.shardId);

    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error(error);
    res.status(error.code).json(error);
  }
});

app.listen(BOT_PORT, () => {
  console.log(`Bot is listening at ${BOT_HOST}:${BOT_PORT};`);
});
