import { NekoDiscordEvent } from "../../structures/NekoDiscordEvent.js";

export default new NekoDiscordEvent({
    listener: "ready",
    async execute(client) {
        await this.application.commands.set(this.commands.toDiscord())

        console.log(`Ready on client ${this.user.username}!`)
    }
})