import { EventHandlers } from '@discordeno/bot';
import { logger } from '@discordeno/utils';

export const ready: EventHandlers['ready'] = async function (payload, shardId) {
  logger.info(`[READY] Shard ID #${shardId} is ready.`);
};
