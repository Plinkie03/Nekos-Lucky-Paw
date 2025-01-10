import { InteractionReplyOptions, RepliableInteraction } from "discord.js";

export class Util {
    public static reply(options: InteractionReplyOptions & { interaction: RepliableInteraction<'cached'> }) {
        return options.interaction[(options.interaction.replied ? "editReply" : options.interaction.isButton() ? "update" : "reply") as "reply"](options)
    }
}