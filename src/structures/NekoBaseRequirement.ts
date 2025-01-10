import { GuildMember, InteractionReplyOptions, InteractionUpdateOptions, RepliableInteraction } from "discord.js"
import { deserialize, serialize } from "v8"
import { Nullable } from "./NekoCommand.js"
import { NekoClient } from "../core/NekoClient.js"
import { NekoGiveaway } from "./NekoGiveaway.js"
import { NekoGiveawayBuilder } from "./NekoGiveawayBuilder.js"

export enum NekoRequirementCheckType {
    Start,
    End,
    Both
}

export interface NekoRequirementBasePayload {
    member: GuildMember
    builder: NekoGiveawayBuilder
}

export interface NekoRequirementBuildResponsePayload extends NekoRequirementBasePayload {
    interaction: RepliableInteraction<'cached'>
}

export interface NekoRequirementSerializePayload<Type> extends Omit<NekoRequirementBasePayload, "member"> {
    data: Type
}

export interface NekoRequirementDeserializePayload<Type> extends Omit<NekoRequirementSerializePayload<Type>, "data"> {
    data: NodeJS.ArrayBufferView
}

export interface NekoRequirementValidationPayload<Type> extends NekoRequirementBasePayload {
    data: Type
}

export interface NekoRequirementInfoPayload extends NekoRequirementBasePayload {}

export interface NekoRequirementData {
    id: number
    name: string
    emoji?: Nullable<string>
    check: NekoRequirementCheckType
}

export abstract class NekoBaseRequirement<Type = any> {
    public constructor(public readonly data: NekoRequirementData) {}

    public get id() {
        return this.data.id
    }

    public abstract build(payload: NekoRequirementBuildResponsePayload): InteractionReplyOptions & InteractionUpdateOptions
    public abstract validate(payload: NekoRequirementValidationPayload<Type>): Promise<boolean>
    public abstract info(payload: NekoRequirementInfoPayload): string
    public abstract serialize(input: NekoRequirementSerializePayload<Type>): Buffer
    public abstract deserialize(input: NekoRequirementDeserializePayload<Type>): Nullable<Type>
}