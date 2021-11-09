import { SlashCommandBuilder } from '@discordjs/builders';
import * as Discord from 'discord.js';
import { client } from '.';
import * as Config from './config';

process.chdir(__dirname);

import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildIds, token } from './config.json';

export async function UpdateCommands() {
	/* Deploy slash commands */
	const commands = [];
	const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'));

	for (const file of commandFiles) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command : { data: SlashCommandBuilder } = require(`./commands/${file}`);
		command.data.setDefaultPermission(false);
		commands.push(command.data.toJSON());
	}

	console.log(`Deploying ${commands.length} commands...`);

	const rest = new REST({ version: '9' }).setToken(token);

	for (const guildId of guildIds) {
		rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
			.then(() => console.log(`Successfully registered application commands for ${guildId}`))
			.catch(console.error);

		/* Update permissions for commands */

		await UpdatePermissions(guildId);
	}
}

export async function UpdatePermissions(guildId: string) {
	const serverConfig = Config.ServerConfigFromID(guildId);
	await client.isReady();

	const guild = await client.guilds.fetch(guildId);
	// const guild = client.guilds.cache.get(guildId);
	if (guild) {
		console.log(`Updating permissions for server: ${guild.name}`);

		const everyonePermission: Discord.ApplicationCommandPermissionData = {
			id: guild.roles.everyone.id,
			type: 'ROLE',
			permission: false,
		};

		const GKZAdminPermission: Discord.ApplicationCommandPermissionData = {
			id: serverConfig.GKZAdminRole,
			type: 'ROLE',
			permission: true,
		};

		const ownerPermission: Discord.ApplicationCommandPermissionData = {
			id: guild.ownerId,
			type: 'USER',
			permission: true,
		};

		const permissions = [everyonePermission, ownerPermission];
		if (serverConfig.GKZAdminRole?.length > 1) {permissions.push(GKZAdminPermission);}
		const commandsList = await guild.commands.fetch();
		await commandsList.forEach(slashCommand => {
			// set the permissions for each slashCommand
			guild.commands.permissions.set({
				command: slashCommand.id,
				permissions: permissions,
			});
		});
	}
}
