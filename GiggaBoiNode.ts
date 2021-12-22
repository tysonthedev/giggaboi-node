const dotenv = require('dotenv');
dotenv.config();
import { ENV_TYPES } from './types/EnvironmentTypes';
const { NODE_ENV, BETA_DISCORD_TOKEN, PRODUCTION_DISCORD_TOKEN } = process.env;

import { Client, ClientOptions, Intents, Interaction } from 'discord.js';
import CommandHandler from './commands/CommandHandler';

const options: ClientOptions = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
};

const client: Client = new Client(options);

client.once('ready', () => {
	console.log('bot is now running...');
});

client.login(NODE_ENV === ENV_TYPES.BETA ? BETA_DISCORD_TOKEN : PRODUCTION_DISCORD_TOKEN);

client.on('interactionCreate', (interaction: Interaction) => {
	if (interaction.isCommand()) {
		CommandHandler(interaction);
	}
});
