# Friend Time

[![Discord Bots](https://discordbots.org/api/widget/status/471091072546766849.svg?noavatar=true)](https://discordbots.org/bot/471091072546766849)[![Discord Bots](https://discordbots.org/api/widget/servers/471091072546766849.svg?noavatar=true)](https://discordbots.org/bot/471091072546766849)

**Discord bot** - Automatically convert times mentioned in chat between time zones!

## [Add to your Discord Server!](https://discordapp.com/oauth2/authorize?client_id=471091072546766849&scope=bot&permissions=522304)

[Join Support Server](https://discord.gg/QMc9Qdk) | [Donate with PayPal!](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EW389DYYSS4FC)

If you have a discord server with users across multiple countries and time zones then this is the bot for you! With Friend Time you can easily coordinate times between users. Friend Time will automatically convert any times mentioned in chat to the times of other users.

Friend Time will automatically react with a clock emoji to times mentioned in chat:

![Example usage](https://i.imgur.com/wyxFxEr.png)

By also reacting, you will be private messaged with the time converted to your time zone:

![Example conversion](https://i.imgur.com/wveOlPz.png)

## Commands

### Help Command

* `-ft` - Show the help menu.

### Core Commands

* `-ft set <zone>` - Set yourself to a time zone.
* `-ft map` - View a map of available time zones.
* `-ft clear` - Clear your time zone.
* `-ft time` - Get the current time.
* `-ft time <user>` - Get the current time of a user.
* `-ft time <zone>` - Get the current time of a time zone.
* `-ft format <12/24>` - Set your time format, 12 or 24 hours.
* `-ft config` - Change server settings, for admins.
* `-ft info` - More information about Friend Time.

### Config Commands

* `-ft config mode <react/list>` - Change the mode that is used for converting times.
* `-ft config format <12/24>` - Change the servers time format, 12 or 24 hours.
* `-ft config notify <on/off>` - Enable or disable reminders for users who don't have a time zone set.

### Info Commands

* `-ft invite` - Invite Friend Time to your server.
* `-ft support` - Get help or report an issue.
* `-ft donate` - Donate to keep Friend Time running!

## Finding Your Time Zone

[Keval Bhatt](https://github.com/kevalbhatt) has created a handy map time zone picker:

<http://kevalbhatt.github.io/timezone-picker/>

Simply click your location on the map, and use the name displayed in the dropdown box as your time zone.

You can then take your time zone name and run the **set** command like so:
`-ft set America/New_York`

![Setting your time zone](https://i.imgur.com/LgaPfp6.png)

Friend Time will then know your time zone and use this to automatically convert any times you mention in chat, as well as convert other users times to your time zone.

## References

* [discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API.
* [Chrono](https://github.com/wanasit/chrono) - A natural language date parser in JavaScript.
* [Moment Timezone](https://momentjs.com/timezone/) - Parse and display dates in any time zone.
