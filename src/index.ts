process.chdir(__dirname);

import fs from 'fs';
import * as Discord from 'discord.js';
import * as Config from './config';
import { UpdateCommands } from './deploy-commands';
import { token } from './config.json';

export const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS ] });

// TODO: Abstract to class to avoid having any as type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands = new Discord.Collection<string, any>();
const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${file}`);
	console.log(`Loading command: ${file}`);
	commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user?.setActivity('GorillaKZ Leaderboards', { type: 'WATCHING' });
	UpdateCommands();
});

client.on('interactionCreate', async (interaction: Discord.Interaction) => {
	if (!interaction.isCommand()) return;

	const config = Config.ServerConfigFromID(interaction.guildId);
	if (!(interaction.member.roles as Discord.GuildMemberRoleManager).cache.has(config.GKZAdminRole)
		&& interaction.guild?.ownerId != interaction.user.id) {
		interaction.reply({
			content: 'You do not have permission to use this command.',
			ephemeral: true,
		});

		return;
	}

	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
