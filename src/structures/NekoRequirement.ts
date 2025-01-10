import { RawRequirementData } from "../core/NekoDatabase.js";
import { NekoResources } from "../core/NekoResources.js";
import { NekoGiveaway } from "./NekoGiveaway.js";
import { NekoGiveawayBuilder } from "./NekoGiveawayBuilder.js";

export class NekoRequirement {
    public constructor(
        private readonly builder: NekoGiveawayBuilder,
        public readonly data: RawRequirementData
    ) {}

    public get requirement() {
        return NekoResources.Requirements.get(this.data.id)
    }

    public get buffer() {
        return this.requirement.serialize({
            builder: this.builder,
            data: this.data
        })
    }

    public get value() {
        return this.requirement.deserialize({
            data: this.data.settings,
            builder: this.builder
        })
    }
}