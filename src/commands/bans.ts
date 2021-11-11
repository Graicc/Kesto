import * as Discord from 'discord.js';
import * as Backend from '../backendinterface';

import { SlashCommandBuilder } from '@discordjs/builders';
import { LogInteraction } from '../log';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bans')
		.setDescription('Manages bans')
		.addSubcommandGroup(group => group
			.setName('ip')
			.setDescription('Manages ip bans')
			.addSubcommand(subcommand => subcommand
				.setName('list')
				.setDescription('Lists all ip bans'),
			)
			.addSubcommand(subcommand => subcommand
				.setName('add')
				.setDescription('Adds an ip ban')
				.addStringOption(option => option
					.setName('ip')
					.setDescription('The ip to ban')
					.setRequired(true),
				),
			)
			.addSubcommand(subcommand => subcommand
				.setName('remove')
				.setDescription('Removes an ip ban')
				.addStringOption(option => option
					.setName('ip')
					.setDescription('The ip to unban')
					.setRequired(true),
				),
			),
		)
		.addSubcommandGroup(group => group
			.setName('user')
			.setDescription('Manages user bans')
			.addSubcommand(subcommand => subcommand
				.setName('list')
				.setDescription('Lists all user bans'),
			)
			.addSubcommand(subcommand => subcommand
				.setName('add')
				.setDescription('Adds a user ban')
				.addStringOption(option => option
					.setName('user')
					.setDescription('The user to ban')
					.setRequired(true),
				),
			)
			.addSubcommand(subcommand => subcommand
				.setName('remove')
				.setDescription('Removes a user ban')
				.addStringOption(option => option
					.setName('user')
					.setDescription('The user to unban')
					.setRequired(true),
				),
			),
		)
		.addSubcommandGroup(group => group
			.setName('run')
			.setDescription('Manages run bans')
			// .addSubcommand(subcommand => subcommand
			// 	.setName('list')
			// 	.setDescription('Lists all run bans'),
			// )
			.addSubcommand(subcommand => subcommand
				.setName('add')
				.setDescription('Adds a run ban')
				.addIntegerOption(option => option
					.setName('run')
					.setDescription('The run to ban')
					.setRequired(true),
				),
			)
			.addSubcommand(subcommand => subcommand
				.setName('remove')
				.setDescription('Removes a run ban')
				.addIntegerOption(option => option
					.setName('run')
					.setDescription('The run to unban')
					.setRequired(true),
				),
			),
		),
	async execute(interaction: Discord.CommandInteraction) {
		const subCommandGroup = interaction.options.getSubcommandGroup();
		const subCommand = interaction.options.getSubcommand();

		const reply : Discord.InteractionReplyOptions = {
			ephemeral: true,
			// content: '',
		};

		const ip : string | null = interaction.options.getString('ip');
		const user : string | null = interaction.options.getString('user');
		const run : number | null = interaction.options.getInteger('run');
		switch (subCommandGroup) {
		case 'ip':{
			switch (subCommand) {
			case 'list': {
				const response = await Backend.getIpBans();
				if (response) {
					reply.content = 'Bans:\n' + response.data.join('\n');
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			case 'add': {
				if (ip) {
					const response = await Backend.addIpBan(ip);
					if (response) {
						reply.content = `Added ip ban for ${ip}`;
						LogInteraction(`Banned ip: ${ip}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			case 'remove': {
				if (ip) {
					const response = await Backend.removeIpBan(ip);
					if (response) {
						reply.content = `Removed ip ban for ${ip}`;
						LogInteraction(`Unbanned ip: ${ip}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			}
			break;
		}
		case 'user': {
			switch (subCommand) {
			case 'list': {
				const response = await Backend.getUserBans();
				if (response) {
					reply.content = 'Bans:\n' + response.data.join('\n');
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			case 'add': {
				if (user) {
					const response = await Backend.addUserBan(user);
					if (response) {
						reply.content = `Added user ban for ${user}`;
						LogInteraction(`Banned user: ${user}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			case 'remove': {
				if (user) {
					const response = await Backend.removeUserBan(user);
					if (response) {
						reply.content = `Removed user ban for ${user}`;
						LogInteraction(`Unbanned user: ${user}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			}
			break;
		}
		case 'run': {
			switch (subCommand) {
			// case 'list': {
			// 	const response = await Backend.getRunBans();
			// 	if (response) {
			// 		reply.content = 'Bans:\n' + response.data.join('\n');
			// 	}
			// 	else {
			// 		reply.content = 'An error occured';
			// 	}
			// 	break;
			// }
			case 'add': {
				if (run != null) {
					const response = await Backend.addRunBan(run);
					if (response) {
						reply.content = `Added run ban for ${run} ${response.data.runner} ${response.data.ip}`;
						LogInteraction(`Banned run: ${run} ${response.data.runner} ${response.data.ip}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured: no run';
				}
				break;

			}
			case 'remove': {
				if (run != null) {
					const response = await Backend.removeRunBan(run);
					if (response) {
						reply.content = `Removed run ban for ${run} ${response.data.runner} ${response.data.ip}`;
						LogInteraction(`Unbanned run: ${run} ${response.data.runner} ${response.data.ip}`, interaction);
					}
					else {
						reply.content = 'An error occured';
					}
				}
				else {
					reply.content = 'An error occured';
				}
				break;
			}
			}
			break;
		}
		}

		interaction.reply(reply);
	},
};