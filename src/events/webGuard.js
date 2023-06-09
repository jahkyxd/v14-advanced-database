import Jahky from "../Base/Jahky.Client.js";
import config from "../../config.js";
import { EmbedBuilder, PermissionsBitField } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("presenceUpdate", async (oldPresence, newPresence) => {
        const bitfields = new Array(
            "2",
            "4",
            "8",
            "16",
            "32",
            "128",
            "134217728",
            "268435456",
            "536870912"
        );

        const presence = Object.keys(newPresence.clientStatus)

        if (
            presence.find(ceki => ceki === "web") &&
            !config.bot.owners.includes(newPresence.member.id) ||
            newPresence.member.id !== newPresence.guild.ownerId ||
            !newPresence.user.bot
        ) {
            if (bitfields.some((x) => newPresence.member.permissions.has(x))) {
                const roles = newPresence.member.roles.cache.filter(
                    (e) =>
                        e.editable &&
                        e.name !== "@everyone" &&
                        bitfields.some((a) => e.permissions.has(a))
                );
                client.webRoles.set(newPresence.member.id, {
                    roles: roles.map((x) => x.id),
                });
                client.channels.cache.get(config.Guild.log).send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(newPresence.member.displayHexColor)
                            .setDescription(
                                `${
                                    newPresence.member
                                } yetkilisi tarayıcıdan giriş yaptığı için ${roles
                                    .map((x) => newPresence.guild.roles.cache.get(x))
                                    .join(", ")} rolleri çekildi!`
                            ),
                    ],
                });
                newPresence.member.roles
                    .remove(roles.map((x) => x.id))
                    .catch((err) => console.log(err));
            }
        }

        if (!presence.find(ceki => ceki === "web") || newPresence.status !== "offline") {
            const data = await client.webRoles.get(newPresence.member.id);
            if (!data) return;
            client.channels.cache.get(config.Guild.log).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(newPresence.member.displayHexColor)
                        .setDescription(
                            `${newPresence.member} yetkilisi tarayıcıdan çıkış yaptığı için eski rolleri geri verildi!`
                        ),
                ],
            });
            newPresence.member.roles
                .add(data.roles.map((x) => x))
                .catch((err) => console.log(err));
            client.webRoles.delete(newPresence.member.id);
        }
    });
};
