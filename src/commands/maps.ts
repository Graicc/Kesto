import * as Discord from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { LogInteraction } from '../log';
import * as Backend from '../backendinterface';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('maps')
		.setDescription('Manages maps')
		.addSubcommand(command => command
			.setName('list')
			.setDescription('Lists all maps'),
		)
		.addSubcommand(command => command
			.setName('add')
			.setDescription('Adds a map')
			.addStringOption(option => option
				.setName('name')
				.setDescription('The name of the map')
				.setRequired(true),
			),
		)
		.addSubcommand(command => command
			.setName('remove')
			.setDescription('Removes a map')
			.addStringOption(option => option
				.setName('name')
				.setDescription('The name of the map')
				.setRequired(true),
			),
		),
	async execute(interaction: Discord.CommandInteraction) {
		const subCommand = interaction.options.getSubcommand();

		const reply : Discord.InteractionReplyOptions = {
			ephemeral: true,
			// content: '',
		};

		const map : string | null = interaction.options.getString('name');
		switch (subCommand) {
		case 'list': {
			const response = await Backend.getMaps();
			if (response) {
				reply.content = 'Maps:\n' + response.data.join('\n');
			}
			else {
				reply.content = 'No maps found';
			}
			break;
		}
		case 'add': {
			if (map) {
				if (await Backend.addMap(map)) {
					reply.content = `Map ${map} added`;
					LogInteraction(`Added map: ${map}`, interaction);
				}
				else {
					reply.content = `Failed to add map ${map}`;
				}
			}
			else {
				reply.content = 'Missing map name';
			}
			break;
		}
		case 'remove': {
			if (map) {
				if (await Backend.removeMap(map)) {
					reply.content = `Map ${map} removed`;
					LogInteraction(`Removed map: ${map}`, interaction);
				}
				else {
					reply.content = `Failed to remove map ${map}`;
				}
			}
			else {
				reply.content = 'Missing map name';
			}
			break;
		}
		}

		interaction.reply(reply);
	},
};