import config from "../../config.js";
import Jahky from "./Default.Client.js";

class Login {
    /**
     *
     * @param {Jahky} client
     */

    static async On(client) {
        client
            .login(config.bot.token)
            .then(() =>
                console.log(
                    `${client.user.username} olarak discord API bağlantısı kuruldu.`
                )
            )
            .catch((err) =>
                console.log("Discord API Botun tokenini doğrulayamadı.")
            );

        await import("../Utils/Client.Functions.js");
    }
}

export default Login;
