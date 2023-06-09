import Jahky from "./src/Base/Default.Client.js";
const client = (global.client = new Jahky());
import load from "./src/Base/load.js";
import login from "./src/Base/login.js";

login.On(client);
load.LoadCommands(client);
load.LoadEvents(client);
