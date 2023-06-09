import Jahky from "../Base/Jahky.Client.js";
import { AuditLogEvent } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("roleUpdate", async (oldRole, newRole) => {
        const entry = await newRole.guild
            .fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 5 })
            .then((x) => x.entries.first());

        const ID = entry.executor.id;

        if (client.safe(ID)) return;
        else {
            if (!entry || !entry.executor) return;
            newRole.guild.bans.create(entry.executor.id, {
                reason: "Jahky. was here!",
            });

            client.channels.cache.get(client.config.Guild.log).send({
                content: `@everyone \`${oldRole.name}\` - \`${oldRole.id}\` rolü ${entry.executor.tag} tarafından güncellendi!`,
            });

            if (newRole.editable) newRole.edit({ ...oldRole });
        }
    });
};
