import { ClientEvents } from "discord.js";
import { NekoClient } from "../core/NekoClient.js";

export interface NekoDiscordEventData<T extends keyof ClientEvents> {
    listener: T
    once?: boolean
    execute: (this: NekoClient, ...args: ClientEvents[T]) => any
}

export class NekoDiscordEvent<T extends keyof ClientEvents = keyof ClientEvents> {
    public constructor(
        public readonly data: NekoDiscordEventData<T>
    ) {}

    public register(client: NekoClient) {
        client[this.data.once ? "once" : "on"](this.data.listener, this.data.execute.bind(client))
    }
}
