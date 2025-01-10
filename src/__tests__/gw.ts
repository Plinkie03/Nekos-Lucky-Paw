import { deserialize } from "v8";
import { NekoClient } from "../core/NekoClient.js";
import { NekoResources } from "../core/NekoResources.js";
import { NekoGiveaway } from "../structures/NekoGiveaway.js";
import { NekoGiveawayBuilder } from "../structures/NekoGiveawayBuilder.js";

const builder = new NekoGiveawayBuilder({} as NekoClient)

const req = NekoResources.Requirements.get(1)

builder.addRequirement(req, [ { id: "123" }])

builder.data.channelId = "123"
builder.data.messageId = "123"
builder.data.userId = "123"
builder.data.endsAt = new Date()
builder.data.prize = "owo"

builder.create().then(gw => {
    console.log(gw)
})