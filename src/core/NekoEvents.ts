import { readdirSync } from "node:fs";
import { NekoClient } from "./NekoClient.js";
import { resolve } from "node:path";
import { NekoDiscordEvent } from "../structures/NekoDiscordEvent.js";
import { ClientEvents, Collection } from "discord.js";

export class NekoEvents extends Collection<keyof ClientEvents, NekoDiscordEvent[]> {
    public constructor(private readonly client: NekoClient) {
        super()
    }

    public async load() {
        for (const dir of readdirSync(resolve("dist", "events"), { withFileTypes: true })) {
            for (const file of readdirSync(resolve(dir.path, dir.name), { withFileTypes: true })) {
                const req = await import(resolve(file.path, file.name)).then(x => x.default) as NekoDiscordEvent
                this.ensure(req.data.listener, () => []).push(req)
                req.register(this.client)
            }
        }
    }
}