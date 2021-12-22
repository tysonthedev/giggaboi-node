const dotenv = require('dotenv');
dotenv.config();
import { ENV_TYPES } from './types/EnvironmentTypes';
const {
	NODE_ENV,
	BETA_GUILD_ID,
	BETA_DISCORD_TOKEN,
	BETA_CLIENT_ID,
	PRODUCTION_DISCORD_TOKEN,
	PRODUCTION_CLIENT_ID,
} = process.env;

import AllCommands from './commands/AllCommands';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const GUILD_ID: string | undefined = NODE_ENV === ENV_TYPES.BETA ? BETA_GUILD_ID : undefined;
const DISCORD_TOKEN: string | undefined = NODE_ENV === ENV_TYPES.BETA ? BETA_DISCORD_TOKEN : PRODUCTION_DISCORD_TOKEN;
const CLIENT_ID: string | undefined = NODE_ENV === ENV_TYPES.BETA ? BETA_CLIENT_ID : PRODUCTION_CLIENT_ID;

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

//register all commands
(async () => {
	try {
		console.log(`Deploying ${NODE_ENV}!`);
		switch (NODE_ENV) {
			case ENV_TYPES.BETA:
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
					body: AllCommands.map((command) => command.data),
				});
				break;
			case ENV_TYPES.PRODUCTION:
				console.warn('It can take up to an hour to fully update commands across all guilds!');
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: AllCommands.map((command) => command.data),
				});
				break;
		}
		console.log(`Successfully deployed ${NODE_ENV}!`);
	} catch (error) {
		console.error(`Failed to deploy ${NODE_ENV}!`);
		console.error(error);
	}
})();
