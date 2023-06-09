import Jahky from "../Base/Jahky.Client.js";
import { AuditLogEvent } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("roleDelete", async (role) => {
        const entry = await role.guild
            .fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 5 })
            .then((x) => x.entries.first());

        const ID = entry.executor.id;

        if (client.safe(ID)) return;
        else {
            if (!entry || !entry.executor) return;
            role.guild.bans.create(entry.executor.id, {
                reason: "Jahky. was here!",
            });

            client.channels.cache.get(client.config.Guild.log).send({
                content: `@everyone \`${role.name}\` - \`${role.id}\` rolü ${entry.executor.tag} tarafından silindi!`,
            });

            const roleData = await client.db.get(
                `roles_${role.guild.id}_${role.id}`
            );

            if (!roleData)
                return client.logger.error(
                    `${role.name} - ${role.id} olayından sonra rol verisi olmadığı için işlemler durduruldu!`
                );

            const newRole = await role.guild.roles.create({
                roleData,
                reason: "Database bot With Jahky.",
            });

            const roleMembers = await client.db.get(
                `roleMembers_${role.guild.id}_${role.id}`
            );

            if (!roleMembers)
                return client.logger.error(
                    `${newRole.name} - ${newRole.id} rolüne ait kullanıcı verisi bulunmadığı için rol dağıtım işlemi iptal edildi!`
                );

            await client.memberAdd_Role(roleMembers, newRole);
        }
    });
};
