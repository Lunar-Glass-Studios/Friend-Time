import { ContextMenuInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class ContextMenuHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.contextMenus.amount,
        Config.rateLimiting.contextMenus.interval * 1000
    );

    public async process(_intr: ContextMenuInteraction): Promise<void> {
        console.log('Hello World!');
        return;
    }
}
