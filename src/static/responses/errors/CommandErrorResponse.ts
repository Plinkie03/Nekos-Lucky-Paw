import { ChatInputCommandInteraction, codeBlock, Colors } from "discord.js";
import { BasicEmbed } from "../../embeds/BasicEmbed.js";
import { Util } from "../../Util.js";

export class CommandErrorResponse {
    private constructor() {}

    public static async from(i: ChatInputCommandInteraction<'cached'>, err: unknown) {
        if (!(err instanceof Error)) return

        const embed = BasicEmbed.from(i, i.user, Colors.Red)
            .setDescription(`An error has occurred whilst executing this command, what did you do!?`)
            .addFields({
                name: "\u200b",
                value: codeBlock("js", err.message)
            })

        await Util.reply({
            interaction: i,
            ephemeral: true,
            embeds: [ embed ]
        })
    }
}