import { config } from "dotenv";
import { NekoClient } from "./core/NekoClient.js";
import { GatewayIntentBits, Partials } from "discord.js";

config()

const client = new NekoClient({
    intents: GatewayIntentBits.Guilds,
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember
    ]
})

client.login()