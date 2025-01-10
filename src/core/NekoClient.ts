import { Client } from "discord.js";
import { NekoCommands } from "./NekoCommands.js";
import NekoDatabase from "./NekoDatabase.js";
import { NekoEvents } from "./NekoEvents.js";
import { env } from "node:process";

export class NekoClient extends Client<true> {
    public readonly commands = new NekoCommands(this)
    public readonly events = new NekoEvents(this)

    public async login(token?: string): Promise<string> {
        await NekoDatabase.$connect()
        await this.events.load()
        await this.commands.load()
        return super.login(env.TOKEN)
    }
}