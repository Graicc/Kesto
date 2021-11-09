import * as Discord from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import * as Config from './../config';
import { LogInteraction } from '../log';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logchannel')
		.setDescription('Set the channel for logging')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('The channel to log to'),
		),
	async execute(interaction: Discord.CommandInteraction) {
		const channel = interaction.options.getChannel('channel');
		const config = Config.ServerConfigFromID(interaction.guildId);

		if (channel) {
			config.LogChannel = channel.id;
			config.Save();
			const LogString = `Set the log channel to <#${channel.id}>`;
			LogInteraction(LogString, interaction);
			interaction.reply(`Log channel set to <#${channel.id}>`);
		}
		else {
			interaction.reply(`Log channel is <#${config.LogChannel}>`);
		}
	},
};