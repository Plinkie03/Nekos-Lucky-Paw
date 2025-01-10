import { NekoCommand } from "../../structures/NekoCommand.js";
import { NekoDiscordEvent } from "../../structures/NekoDiscordEvent.js";

export default new NekoDiscordEvent({
    listener: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return
        await NekoCommand.handle(this, interaction) 
    }
})