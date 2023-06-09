import Jahky from "../Base/Default.Client.js";
import { ActivityType } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("ready", async () => {
        client.user.setPresence({
            activities: [
                {
                    name: `Jahky. ❤️ ${client.config.Guild.GuildName}`,
                    type: ActivityType.Listening,
                },
            ],
            status: "idle",
        });

        if (!client.db.get("safe")) client.db.set("safe", []);
        client.backup();

        setInterval(() => {
            client.backup();
        }, 1000 * 60 * 60 * 15);
    });
};
