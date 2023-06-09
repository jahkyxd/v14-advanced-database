import { Client, GatewayIntentBits, Collection, Role } from "discord.js";
import logger from "./logger.js";
import config from "../../config.js";
import db from "ceki.db";
const intents = Object.keys(GatewayIntentBits);

class Jahky extends Client {
    constructor() {
        super({
            intents,
        });
        this.commands = new Collection();
        this.aliases = new Collection();
        this.config = global.config = config;
        global.system = this;
        this.logger = logger;
        this.db = global.db = db;
        this.webRoles = new Collection();
    }

    async wait(ms = Number) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    async backup() {
        let rolesize;
        this.guilds.cache
            .get(config.Guild.GuildID)
            .roles.cache.forEach(async (role) => {
                if (role.name === "@everyone") return;
                db.set(`roles_${role.guild.id}_${role.id}`, {
                    name: role.name,
                    color: role.hexColor,
                    unicodeEmoji: role.unicodeEmoji,
                    position: role.rawPosition,
                    mentionable: role.mentionable,
                    permissions: role.permissions,
                    hoist: role.hoist,
                });

                db.set(
                    `roleMembers_${role.guild.id}_${role.id}`,
                    role.members.map((x) => x.id)
                );

                role.guild.channels.cache
                    .filter((channel) =>
                        channel.permissionOverwrites.cache.has(role.id)
                    )
                    .forEach((channel) => {
                        let channelPerm =
                            channel.permissionOverwrites.cache.get(role.id);
                        let push = {
                            id: channel.id,
                            allow: channelPerm.allow.toArray(),
                            deny: channelPerm.deny.toArray(),
                        };
                        roleChannelOverwrites.push(push);
                    });

                this.client.db.set(
                    `channelPerm_${role.id}`,
                    roleChannelOverwrites
                );

                const i = role.guild.roles.cache.filter(
                    (rls) => rls.name !== "@everyone"
                ).size;
                rolesize = i;
            });

        this.logger.log(
            `${rolesize} rolün yedeği başarılı bir şekilde alındı!`
        );
    }

    /**
     *
     * @param {Array} memberArray
     * @param {RoleID} roleID
     */

    async memberAdd_Role(memberArray, roleID) {
        memberArray.forEach(async (id, index) => {
            const member = this.guilds.cache
                .get(config.Guild.GuildID)
                .members.cache.get(id);
            const role = this.guilds.cache
                .get(config.Guild.GuildID)
                .roles.cache.get(roleID);

            if (!member || !role) return;

            setTimeout(() => {
                member.roles
                    .add(role.id)
                    .then(() =>
                        this.logger.log(
                            `${member.user.tag} kullanıcısına ${role.name} rolü verildi`
                        )
                    )
                    .catch(() =>
                        this.logger.error(
                            `${member.user.tag} kullanıcısına ${role.name} rolü verilemedi`
                        )
                    );
            }, index * 1500);
        });
    }

    /**
     *
     * @param {UserID} executorID
     */

    async safe(executorID) {
        if (db.get("safe")) {
            if (
                Array.from(db.get("safe")).includes(executorID) ||
                executorID === this.user.id ||
                this.guilds.cache.get(config.Guild.GuildID).ownerId ===
                    executorID
            )
                return true;
            else return false;
        } else return false;
    }

    /**
     *
     * @param {Role} role
     */

    async channelPermissionsConfigs(role) {
        setTimeout(() => {
            let channelPerm = this.db.get(`channelPerm_${role.id}`);
            if (channelPerm)
                channelPerm.forEach((perm, index) => {
                    let channel = role.guild.channels.cache.get(perm.id);
                    if (!channel) return;
                    setTimeout(() => {
                        let newChannelPerm = {};
                        perm.allow.forEach((p) => {
                            newChannelPerm[p] = true;
                        });
                        perm.deny.forEach((p) => {
                            newChannelPerm[p] = false;
                        });
                        channel.permissionOverwrites
                            .create(role, {})
                            .catch(console.error);
                    }, index * 5000);
                });
        }, 5000);
    }
}

export default Jahky;
