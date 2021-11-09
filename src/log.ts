import * as Config from "./config";
import * as Discord from "discord.js";
import {client} from "./index";
import { UserString } from "./helpers";

export function Log(user: Discord.User | null, message: string, guild_id: string) {
    if (user) message = UserString(user) + ": " + message;

    const config = Config.ServerConfigFromID(guild_id);
    if(config.LogChannel != null && config.LogChannel != ""){
        // log it
        const guild = client.guilds.cache.find(guild => guild.id === guild_id);
        if(guild){
            const channel = guild.channels.cache.find(channel => channel.id === config.LogChannel) as Discord.TextChannel;
            if(channel) channel.send(message);
        }
    }
}

export function LogInteraction(message: string, interaction: Discord.Interaction) {
    Log(interaction.user, message, interaction.guildId);
}