import { DiscordAPIError, DMChannel, MessageReaction, User } from 'discord.js';

import { ServerData } from '../models/database-models';
import { Logs } from '../models/internal-language';
import { ServerRepo, UserRepo } from '../repos';
import { Logger, MessageSender, TimeFormatService, TimeParser, ZoneService } from '../services';
import { LangCode, MessageName } from '../services/language';
import { StringUtils } from '../utils';

export class ReactionHandler {
    constructor(
        private emoji: string,
        private msgSender: MessageSender,
        private timeParser: TimeParser,
        private zoneService: ZoneService,
        private timeFormatService: TimeFormatService,
        private serverRepo: ServerRepo,
        private userRepo: UserRepo,
        private logger: Logger,
        private logs: Logs
    ) {}

    public async process(messageReaction: MessageReaction, reactor: User): Promise<void> {
        let reactedEmoji = messageReaction.emoji.name;
        if (reactedEmoji !== this.emoji) {
            return;
        }

        // Don't respond to bots
        if (reactor.bot) {
            return;
        }

        // Fill partial structures
        try {
            if (messageReaction.partial) {
                messageReaction = await messageReaction.fetch();
            }
            if (messageReaction.message.partial) {
                messageReaction.message = await messageReaction.message.fetch();
            }
        } catch (error) {
            // Error code 50001: "Missing Access"
            if (error instanceof DiscordAPIError && error.code === 50001) {
                return;
            } else {
                this.logger.error(this.logs.retrievePartialReactionMessageError, error);
                return;
            }
        }

        let msg = messageReaction.message;

        let result = this.timeParser.parseTime(msg.content);
        if (!this.timeParser.shouldRespond(result)) {
            return;
        }

        // TODO: Dynamically get lang code based on server setting
        let langCode = LangCode.en;

        let dmChannel: DMChannel;
        try {
            dmChannel = reactor.dmChannel ?? (await reactor.createDM());
        } catch (error) {
            this.logger.error(this.logs.createDmChannelError, error);
            return;
        }

        let server = msg.guild;
        if (server) {
            let serverData: ServerData;
            try {
                serverData = await this.serverRepo.getServerData(server.id);
            } catch (error) {
                await this.msgSender.send(dmChannel, langCode, MessageName.retrieveServerDataError);
                this.logger.error(this.logs.retrieveServerDataError, error);
                return;
            }

            if (serverData.Mode !== 'React') {
                return;
            }
        }

        let author = msg.author;
        let userZone: string;
        let userFormat: string;
        try {
            let userData = await this.userRepo.getUserData(reactor.id);
            userZone = userData.TimeZone;
            userFormat = userData.TimeFormat;
        } catch (error) {
            await this.msgSender.send(dmChannel, langCode, MessageName.retrieveUserDataError);
            this.logger.error(this.logs.retrieveUserDataError, error);
            return;
        }

        if (!userZone) {
            await this.msgSender.send(dmChannel, langCode, MessageName.noZoneSetSelf);
            return;
        }

        let authorZone: string;
        try {
            let authorData = await this.userRepo.getUserData(author.id);
            authorZone = authorData.TimeZone;
        } catch (error) {
            await this.msgSender.send(dmChannel, langCode, MessageName.retrieveUserDataError);
            this.logger.error(this.logs.retrieveUserDataError, error);
            return;
        }

        if (!authorZone) {
            await this.msgSender.send(dmChannel, langCode, MessageName.noZoneSetUser, [
                { name: '{USER_ID}', value: author.id },
            ]);
            return;
        }

        let moment = this.zoneService.convert(result, authorZone, userZone);

        let timeFormat = this.timeFormatService.findTimeFormat(userFormat);
        let format = this.timeParser.dayIsCertain(result.start)
            ? `${timeFormat.dateFormat} ${timeFormat.timeFormat}`
            : timeFormat.timeFormat;

        let formattedTime = moment.format(format);
        let quote = StringUtils.formatQuote(result.text);

        await this.msgSender.send(dmChannel, langCode, MessageName.convertedTime, [
            { name: '{AUTHOR_ID}', value: author.id },
            { name: '{QUOTE}', value: quote },
            { name: '{AUTHOR_ZONE}', value: authorZone },
            { name: '{USER_ZONE}', value: userZone },
            { name: '{CONVERTED_TIME}', value: formattedTime },
        ]);
    }
}
