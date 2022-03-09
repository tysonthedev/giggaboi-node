const dotenv = require('dotenv');
dotenv.config();
import { ENV_TYPES } from './types/EnvironmentTypes';
const { NODE_ENV, BETA_DISCORD_TOKEN, PRODUCTION_DISCORD_TOKEN, COMMAND_PREFIX } = process.env;

import { Client, ClientOptions, Intents, Interaction, Message } from 'discord.js';
import './augmentedTypes/discordJS';
import CommandHandler from './commands/CommandHandler';

import GiggaBoiNodeClient from './GiggaBoiNodeClient';

GiggaBoiNodeClient.once('ready', () => {
	console.log('bot is now running...');
});

GiggaBoiNodeClient.login(NODE_ENV === ENV_TYPES.BETA ? BETA_DISCORD_TOKEN : PRODUCTION_DISCORD_TOKEN);

GiggaBoiNodeClient.on('messageCreate', async (message: Message) => {
	if (message.author.bot) return;
	if ((message.content?.length ?? 0) <= (COMMAND_PREFIX?.length ?? 0)) return;
	CommandHandler(message);
});

GiggaBoiNodeClient.on('interactionCreate', async (interaction: Interaction) => {
	if (interaction.member.user.bot) return;
	CommandHandler(interaction);
});
