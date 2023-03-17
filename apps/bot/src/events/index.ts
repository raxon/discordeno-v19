import type { EventHandlers } from '@discordeno/bot';
import { ready } from './ready.js';

export const events: Partial<EventHandlers> = {
  ready,
};
