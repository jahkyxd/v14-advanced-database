import Jahky from "../Base/Jahky.Client.js";
import { AuditLogEvent } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("roleCreate", async (role) => {
        const entry = await role.guild
            .fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 5 })
            .then((x) => x.entries.first());

        const ID = entry.executor.id;

        console.log(await client.safe(ID));

        if (await client.safe(ID)) return;
        else {
            if (!entry || !entry.executor) return;
            role.guild.bans.create(entry.executor.id, {
                reason: "Jahky. was here!",
            });

            role.guild.bans.create(entry.executor.id, {
                reason: "Jahky. was here!",
            });

            client.channels.cache.get(client.config.Guild.log).send({
                content: `@everyone \`${role.name}\` - \`${role.id}\` rolü ${entry.executor.tag} tarafından oluşturuldu !`,
            });

            role.delete("Jahky. was here!");
        }
    });
};
