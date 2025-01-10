import { InteractionReplyOptions, InteractionUpdateOptions, Role } from "discord.js";
import { NekoBaseRequirement, NekoRequirementBuildResponsePayload, NekoRequirementCheckType, NekoRequirementDeserializePayload, NekoRequirementInfoPayload, NekoRequirementSerializePayload, NekoRequirementValidationPayload } from "../../structures/NekoBaseRequirement.js";
import { Nullable } from "../../structures/NekoCommand.js";
import { deserialize, serialize } from "v8";

export class NekoRoleRequirement extends NekoBaseRequirement<Role[]> {
    constructor() {
        super({
            id: 1,
            check: NekoRequirementCheckType.Both,
            name: "Role(s) Requirement"
        })
    }

    public build(payload: NekoRequirementBuildResponsePayload): InteractionReplyOptions & InteractionUpdateOptions {
        throw new Error("Method not implemented.");
    }

    public validate(payload: NekoRequirementValidationPayload<Role[]>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public info(payload: NekoRequirementInfoPayload): string {
        throw new Error("Method not implemented.");
    }

    public serialize(input: NekoRequirementSerializePayload<Role[]>): Buffer {
        return serialize(input.data.map(x => x.id))
    }

    public deserialize(input: NekoRequirementDeserializePayload<Role[]>): Nullable<Role[]> {
        const ids = <string[]>deserialize(input.data)
        const roles = ids.map(id => input.builder.getGuild()?.roles.cache.get(id))
        return roles.filter(Boolean) as Role[]
    }
}