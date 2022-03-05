import { Message } from 'discord.js';
const { COMMAND_PREFIX } = process.env;

declare module 'discord.js' {
	interface Message<Cached extends boolean = boolean> extends Base {
		isCommand(): boolean;
		commandName: string;
	}
}

Object.defineProperty(Message.prototype, 'commandName', {
	get: function commandName() {
		return this.content.split(' ', 1)[0].substring(COMMAND_PREFIX?.length, this.content.split(' ', 1)[0].length);
	},
});

Message.prototype.isCommand = function () {
	return true;
};
