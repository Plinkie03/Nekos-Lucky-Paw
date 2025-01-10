import { ApplicationCommandData, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Collection } from "discord.js";
import { NekoClient } from "./NekoClient.js";
import { NekoCommand } from "../structures/NekoCommand.js";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export class NekoCommands extends Collection<string, NekoCommand | Collection<string, NekoCommand>> {
    public constructor(private readonly client: NekoClient) {
        super()
    }

    public async load() {
        for (const file of readdirSync(resolve("dist", "commands"), { withFileTypes: true })) {
            if (file.isDirectory()) {
                const commands = new Collection<string, NekoCommand>()
                
                for (const secondFile of readdirSync(resolve(file.path, file.name), { withFileTypes: true })) {
                    if (secondFile.isFile()) {
                        const req = await import(resolve(secondFile.path, secondFile.name)).then(x => x.default) as NekoCommand
                        commands.set(req.data.name, req)
                    }
                }

                this.set(file.name, commands)
            } else {
                const req = await import(resolve(file.path, file.name)).then(x => x.default) as NekoCommand
                this.set(req.data.name, req)
            }
        }
    }

    public from(i: ChatInputCommandInteraction<'cached'>) {
        const command = this.get(i.commandName)

        if (!command) return null
        else if (command instanceof Collection)
            return command.get(i.options.getSubcommand(true)) ?? null
        return command
    }

    public toDiscord() {
        const output = new Array<ApplicationCommandData>()

        for (const [ commandName, command ] of this) {
            if (command instanceof Collection) {
                output.push({
                    name: commandName,
                    description: "Unknown",
                    options: command.map(x => x.toJSON(ApplicationCommandOptionType.Subcommand)) as unknown as ApplicationCommandOptionData[]
                })
            } else {
                output.push(command.toJSON())
            }
        }

        return output
    }
}