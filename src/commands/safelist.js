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
 * @param {String} prefix
 */

export const operate = async (
    client,
    message,
    args,
    embed,
    channel,
    author,
    guild,
    prefix
) => {
    channel.send({
        embeds: [
            embed.setDescription(
                `Güvenli liste:\n\n${
                    client.db.get("safe")
                        ? client.db
                              .get("safe")
                              .map((x) => guild.members.cache.get(x))
                              .join("\n")
                        : "Sistemde ekli bir kişi bulunmuyor!"
                }`
            ),
        ],
    });
};

export const info = {
    name: "safelist",
    aliases: ["list"],
    GuildOwner: true,
};
