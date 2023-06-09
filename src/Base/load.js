import { readdir, readdirSync } from "fs";
import Jahky from "./Default.Client.js";

class Load {
    /**
     *
     * @param {Jahky} client
     */

    static async LoadCommands(client) {
        readdirSync("./src/commands", { encoding: "utf8" })
            .filter((file) => file.endsWith(".js"))
            .forEach(async (files) => {
                const prop = await import(`../commands/${files}`);
                if (!prop.info || !prop.operate) return;

                client.commands.set(prop.info.name, prop);

                if (!prop.info.aliases || prop.info.aliases.length < 1) return;
                prop.info.aliases.forEach((otherUses) => {
                    client.aliases.set(otherUses, prop.name);
                });
            });
    }

    /**
     *
     * @param {Jahky} client
     */

    static async LoadEvents(client) {
        readdir("./src/events", (err, files) => {
            if (err) console.log(err);
            files.forEach(async (file) => {
                const event = await import(`../events/${file}`).then(
                    (modules) => modules.default
                );
                event(client);
            });
        });
    }
}

export default Load;
