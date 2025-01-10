import { ApplicationCommandData, ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, Colors, inlineCode } from "discord.js"
import { NekoClient } from "../core/NekoClient.js"
import { Util } from "../static/Util.js";
import { BasicEmbed } from "../static/embeds/BasicEmbed.js";
import { CommandErrorResponse } from "../static/responses/errors/CommandErrorResponse.js";
import { Enum } from "../static/Enum.js";

export enum NekoArgType {
    Integer,
    Number,
    String,
    Enum
}

export type EnumLike<T = any> = {
    [id: string]: T | string;
    [nu: number]: string;
}

export type GetEnum<T> = T extends EnumLike<infer L> ? L : never

export interface NekoArgData<Type extends NekoArgType = NekoArgType, Enum extends EnumLike = EnumLike, Required extends boolean = boolean> {
    name: string
    required?: Required
    description: string
    type: Type
    enum?: Enum
    min?: number
    max?: number
    autocomplete?: (this: NekoClient, payload: NekoAutocompletePayload) => Promise<ApplicationCommandOptionChoiceData[]>
}

export interface NekoAutocompletePayload {
    interaction: AutocompleteInteraction<'cached'>
    query: string
}

export interface NekoCommandPayload<Args extends [...NekoArgData[]]> {
    interaction: ChatInputCommandInteraction<'cached'>
    args: UnwrapArgs<Args>
    command: NekoCommand<Args>
}

export interface NekoCommandData<Args extends [...NekoArgData[]]> {
    name: string
    args?: [...Args]
    description: string
    defer?: boolean
    execute: (this: NekoClient, payload: NekoCommandPayload<Args>) => Promise<boolean>
}

export type Nullable<T> = T | null
export type GetRealArgType<T, Enum extends EnumLike> = T extends NekoArgType.Enum ? Enum : T extends NekoArgType.String ? string : number
export type MarkArgNullable<T, Required extends boolean> = Required extends true ? T : Nullable<T>
export type UnwrapArg<T> = T extends NekoArgData<infer T, infer E, infer R> ? MarkArgNullable<GetRealArgType<T, E>, R> : never
export type UnwrapArgs<T> = T extends [infer L, ...infer R] ? [ UnwrapArg<L>, ...UnwrapArgs<R> ] : []

export class NekoCommand<Args extends [...NekoArgData[]] = []> {
    public constructor(
        public readonly data: NekoCommandData<Args>
    ) { }

    private async reject(i: ChatInputCommandInteraction<'cached'>, arg: NekoArgData) {
        await Util.reply({
            interaction: i,
            embeds: [
                BasicEmbed.from(i, i.user, Colors.Red)
                    .setDescription(`The value given for ${inlineCode(arg.name)} is not valid, why are you so mean?`)
            ]
        })
        return null
    }

    private async resolveArgs(i: ChatInputCommandInteraction<'cached'>) {
        const args = new Array() as Args

        if (!this.data.args?.length) return args

        for (const arg of this.data.args) {
            const resolved = await this.resolveArg(i, arg)

            if (resolved === null && arg.required) {
                return this.reject(i, arg)
            }

            args.push(resolved ?? null)
        }

        return args
    }

    private async resolveArg(i: ChatInputCommandInteraction<'cached'>, arg: NekoArgData) {
        let resolved: any = null

        switch (arg.type) {
            case NekoArgType.Enum:
                resolved = i.options.getInteger(arg.name, arg.required)
                break

            default:
                i.options[`get${NekoArgType[arg.type] as Exclude<keyof typeof NekoArgType, "Enum">}`](arg.name, arg.required)
                break
        }

        return resolved
    }

    public toJSON(option?: ApplicationCommandOptionType) {
        return {
            name: this.data.name,
            description: this.data.description,
            dmPermission: false,
            nsfw: false,
            type: option,
            options: this.data.args?.map(x => ({
                name: x.name,
                description: x.description,
                required: x.required,
                choices: x.enum ? Enum.entries(x.enum).map(x => ({
                    name: x[0],
                    value: x[1]
                })) : undefined,
                type: NekoCommand.getDiscordArgType(x.type),
                autocomplete: !!x.autocomplete,
                maxValue: x.max,
                minValue: x.min,
                maxLength: x.max,
                minLength: x.min,
            })),
        } as ApplicationCommandData
    }

    public static async handle(client: NekoClient, i: ChatInputCommandInteraction<'cached'>) {
        const command = client.commands.from(i)

        if (!command) {
            await i.reply({
                ephemeral: true,
                content: "Wut, what is this command?"
            })

            return
        }

        try {
            const args = await command.resolveArgs(i)
            if (args === null) {
                return
            }

            const result = await command.data.execute.call(client, {
                interaction: i,
                args,
                command
            })
        } catch (error) {
            console.error(error)
            await CommandErrorResponse.from(i, error)
        } finally {}
    }

    public static getDiscordArgType(type: NekoArgType): ApplicationCommandOptionType {
        switch (type) {
            case NekoArgType.Number:
                return ApplicationCommandOptionType.Number

            case NekoArgType.String:
                return ApplicationCommandOptionType.String
            
            case NekoArgType.Integer:
            case NekoArgType.Enum: 
                return ApplicationCommandOptionType.Integer
        }
    }
}