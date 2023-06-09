import Jahky from "../Base/Default.Client.js";
import { Message, EmbedBuilder, TextChannel, User, Guild } from "discord.js";

/**
 * 
 * @param {Jahky} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 * @param {EmbedBuilder} embed 
 * @param {TextChannel} channel 
 * @param {User} author 
 * @param {Guild} guild 
 */

export const operate = async (
    client,
    message,
    args,
    embed,
    channel,
    author,
    guild
) => {
    channel.send({embeds: [embed.setDescription(`Anlık olarak \`${client.ws.ping}\` ms gecikmem var`)]})
};

export const info = {
    name: "ping",
    aliases: [],
    owner: true
};
