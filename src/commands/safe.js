import Jahky from "../Base/Jahky.Client.js";
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
    const members =
        message.mentions.members.map((x) => x) ||
        args
            .filter((id) => guild.members.cache.has(id))
            .map((id) => guild.members.cache.get(id));

    if (!members)
        return channel.error(
            message,
            "Lütfen sisteme eklenilecek olan kişileri etiketleyin\n\nörn: .safe [@BoranGkdn/ID] [@Jahky./ID]"
        );

    const messages = await channel.send({
        embeds: [
            embed.setDescription(
                `${members
                    .map((x) => x.toString())
                    .join(
                        ", "
                    )} kişilerini sisteme ekleme/çıkarma işlemini onaylıyor musunuz!\n\nOnay: **${prefix}evet**, İptal: **${prefix}hayır**`
            ),
        ],
    });

    const filter = (msg) =>
        msg.author.id === author.id &&
        ["evet", "hayır"].some((ceki) =>
            msg.content.toLowerCase().includes(ceki)
        );

    const collector = await channel.awaitMessages({
        filter,
        time: 30000,
        max: 1,
    });

    if (collector.size < 1) {
        messages.edit({
            embeds: [
                embed.setDescription(
                    "Belirtilen sürede işlem belirtmediğiniz için sisteme ekleme/çıkarma iptal edildi!"
                ),
            ],
        });
    }

    const content = collector.first().content.toLowerCase();

    if (content.includes("evet")) {
        const array = new Array();
        if (client.db.get("safe")) {
            members.forEach(async (member) => {
                const data = Array.from(db.get("safe"));

                if (data.includes(member.id)) {
                    client.db.pull("safe", member.id);
                    array.push(
                        `${member.toString()} kullanıcısı sistemden çıkarıldı :x:`
                    );
                } else {
                    client.db.push("safe", member.id);
                    array.push(
                        `${member.toString()} kullanıcısı sisteme eklendi ✅`
                    );
                }
            });
        } else {
            members.forEach(async (member) => {
                client.db.push("safe", member.id);
                array.push(
                    `${member.toString()} kullanıcısı sisteme eklendi ✅`
                );
            });
        }

        client.wait(2500);

        messages.edit({
            embeds: [
                embed.setDescription(
                    `İşleminiz Başarıyla onaylandı! Gerçekleştirilen işlemler:\n\n${array
                        .map((x) => x)
                        .join("\n")}`
                ),
            ],
        });
    }

    if (content.includes("hayır")) {
        messages.edit({
            embeds: [embed.setDescription("İşleminiz iptal edilmiştir :x:")],
        });
    }
};

export const info = {
    name: "safe",
    aliases: ["güvenli"],
    GuildOwner: true,
};
