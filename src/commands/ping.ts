import { NekoArgType, NekoCommand } from "../structures/NekoCommand.js";

enum Uwu {
    One,
    Two
}

export default new NekoCommand({
    name: "ping",
    description: "A normal ping command",
    args: [
        {
            name: "yes",
            description: "ok",
            type: NekoArgType.Enum,
            required: true,
            enum: Uwu
        }
    ],
    async execute(payload) {
        await payload.interaction.reply("Hewwo")
        return true
    }
})