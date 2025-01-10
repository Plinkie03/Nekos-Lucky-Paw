import { GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import { NekoClient } from "../core/NekoClient.js";
import { RawGiveaway } from "@prisma/client";
import { serialize } from "v8";
import { RawGiveawayData } from "../core/NekoDatabase.js";
import { NekoResources } from "../core/NekoResources.js";
import { NekoBaseRequirement } from "./NekoBaseRequirement.js";
import { NekoRequirement } from "./NekoRequirement.js";
import { NekoGiveawayBuilder } from "./NekoGiveawayBuilder.js";

export class NekoGiveaway {
    public readonly builder: NekoGiveawayBuilder

    public constructor(public readonly client: NekoClient, public readonly data: RawGiveawayData) {
        this.builder = new NekoGiveawayBuilder(client, data)
    }
}