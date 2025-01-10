import { Base, ColorResolvable, EmbedBuilder, User } from "discord.js";

export class BasicEmbed {
    private constructor() {}

    public static from(base: Base, to: User, color: ColorResolvable) {
        return new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name: to.displayName,
                iconURL: to.displayAvatarURL()
            })
            .setTimestamp()
            .setFooter({
                text: `Made with love ❤`,
                iconURL: base.client.user.displayAvatarURL()
            })
    }
}