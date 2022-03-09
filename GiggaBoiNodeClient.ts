import { Client, ClientOptions, Intents } from 'discord.js';

const options: ClientOptions = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
};

const client: Client = new Client(options);

export default client;
