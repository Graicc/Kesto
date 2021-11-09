import * as Discord from 'discord.js';

export function UserString(user: Discord.User): string {
    return `${user.username}#${user.discriminator} (${user.id})`;
}