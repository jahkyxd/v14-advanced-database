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
    const roleID = args[0];
    if (!roleID || isNaN(roleID))
        return channel.error(
            message,
            "Lütfen bir rol ID si belirtin veya belirttiğiniz ID sayılardan oluşsun!"
        );

    const roleData = await client.db.get(`roles_${guild.id}_${roleID}`);

    if (roleData)
        return channel.error(
            message,
            `${roleID} ID sine ait bir rol verisi bulunmamaktadır!`
        );

    const roleMembers = client.db.get(`roleMembers_${guild.id}_${roleID}`);

    const newRole = await guild.roles.create({
        roleData,
        reason: "Database bot With BG & Jahky.",
    });

    if (!roleMembers)
        return channel.error(
            message,
            `${newRole.name} rolüne ait kullanıcı verisi bulunmadığı için rol dağıtım işlemi iptal edildi!`
        );

    client.memberAdd_Role(roleMembers, newRole.id);

    channel.send({
        embeds: [
            embed.setDescription(
                `${role} rolünü oluşturup önceki rolde bulunan kullanıcılara rollerini geri vermeye başladım!`
            ),
        ],
    });
};

export const info = {
    name: "rolkur",
    aliases: [],
    GuildOwner: true,
};
