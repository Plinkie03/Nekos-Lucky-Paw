import { RawGiveaway } from "@prisma/client";
import NekoDatabase, { RawGiveawayData, RawRequirementData } from "../core/NekoDatabase.js";
import { NekoClient } from "../core/NekoClient.js";
import { GuildTextBasedChannel } from "discord.js";
import { NekoBaseRequirement } from "./NekoBaseRequirement.js";
import { NekoRequirement } from "./NekoRequirement.js";
import { NekoGiveaway } from "./NekoGiveaway.js";

export class NekoGiveawayBuilder {
    public constructor(public readonly client: NekoClient, public readonly data: Partial<RawGiveawayData> = {}) {
        this.data.requirements ??= []
    }

    public getPrize() {
        return this.data.prize!
    }

    public getUser() {
        return this.client.users.fetch(this.data.userId!)
    }

    public getColor() {
        return this.data.color!
    }

    public getMessage() {
        return this.getChannel().messages.fetch(this.data.messageId!)
    }

    public getGuild() {
        return this.getChannel().guild
    }

    public getClient() {
        return this.client
    }

    public getChannel() {
        return this.client.channels.cache.get(this.data.channelId!) as GuildTextBasedChannel
    }

    public addRequirement(req: NekoBaseRequirement, data: unknown) {
        this.data.requirements!.push({
            // @ts-ignore
            giveawayId: undefined,
            id: req.id,
            settings: req.serialize({
                data,
                builder: this
            })
        })
    }

    public hasRequirement(req: NekoBaseRequirement) {
        return this.data.requirements!.find(x => x.id === req.id)
    }

    public getRequirements() {
        return this.data.requirements!.map(x => new NekoRequirement(this, x))
    }

    public validate() {
        return !!this.data.userId && !!this.data.channelId && !!this.data.endsAt && !!this.data.prize && !!this.data.messageId
    }

    public create() {
        return NekoDatabase.createRawGiveaway(<any>this.data).then(x => new NekoGiveaway(this.client, x))
    }
}