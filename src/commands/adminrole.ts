import * as Discord from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import * as Config from './../config';
import { LogInteraction } from '../log';
import { UpdatePermissions } from '../deploy-commands';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adminrole')
		.setDescription('Set the admin role for the server')
		.addRoleOption(option => option
			.setName('role')
			.setDescription('The role to set as admin'),
		),
	async execute(interaction: Discord.CommandInteraction) {
		const role = interaction.options.getRole('role');
		const config = Config.ServerConfigFromID(interaction.guildId);

		const reply : Discord.InteractionReplyOptions = {
			ephemeral: true,
			// content: '',
		};

		if (role) {
			config.GKZAdminRole = role.id;
			config.Save();

			UpdatePermissions(interaction.guildId);

			const LogString = `Set the admin role to <@&${role.id}>`;
			LogInteraction(LogString, interaction);
			reply.content = `Set admin role to <@&${role.id}>`;
		}
		else {
			reply.content = `Admin role is <@&${config.GKZAdminRole}>`;
		}

		interaction.reply(reply);
	},
};