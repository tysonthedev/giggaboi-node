import { CreateVoiceConnectionOptions, joinVoiceChannel, JoinVoiceChannelOptions } from '@discordjs/voice';
import { GuildMember, Interaction, Message } from 'discord.js';

import ConnectResponse from './types/ConnectResponse';

async function connect(interaction: Interaction | Message): Promise<ConnectResponse> {
	const interactionMember = interaction.member as GuildMember;
	if (!Boolean(interactionMember.voice.channelId))
		return {
			success: false,
			error: 'User not connected to voice channel',
		};

	const voiceChannelOptions: JoinVoiceChannelOptions & CreateVoiceConnectionOptions = {
		channelId: interactionMember.voice.channelId!,
		guildId: interactionMember.guild.id,
		adapterCreator: interactionMember.guild.voiceAdapterCreator,
	};
	const connection = await joinVoiceChannel(voiceChannelOptions);
	return {
		connection: connection,
		success: true,
	};
}

export default connect;
