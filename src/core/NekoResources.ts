import { Collection } from "discord.js"
import { readdirSync } from "fs"
import { resolve } from "path"
import { NekoBaseRequirement } from "../structures/NekoBaseRequirement.js"
import { FileScheme } from "../constants.js"

export type Identifiable = unknown & { id: number }

export class NekoResourceCache<T extends Identifiable> extends Array<T> {
    public readonly collection: Collection<number, T>

    public constructor(...many: T[]) {
        super(...many)
        this.collection = new Collection<number, T>(many.map(x => [x.id, x]))
    }

    public set(...many: T[]) {
        for (const one of many) {
            if (this.collection.has(one.id)) {
                throw new Error(`${one.id} is already in the cache! For instance type ${one.constructor.name}`)
            }

            this.collection.set(one.id, one)
        }
    }

    public get(id: number) {
        const el = this.collection.get(id)

        if (!el) throw new Error(`${id} does not exist on ${this[0]?.constructor.name}!`)

        return el 
    }

    public static async fromPath<T extends Identifiable>(path: string) {
        return new this(...(await NekoResources.load<T>(path)))
    }
}

export class NekoResources {
    public static readonly ResourcePath = resolve("dist", "resources")
    public static readonly RequirementPath = resolve(this.ResourcePath, "requirements")
    
    public static Requirements: NekoResourceCache<NekoBaseRequirement>

    public static async init() {
        NekoResources.Requirements = await NekoResourceCache.fromPath(NekoResources.RequirementPath)
    }

    public static async load<T extends Identifiable>(path: string) {
        const arr = new Array<T>()

        for (const file of readdirSync(path, { withFileTypes: true, recursive: true })) {
            if (file.isDirectory())
                continue

            const req = await import(FileScheme + resolve(file.path, file.name)).then(x => x[Object.keys(x)[0]]) as new () => T

            arr.push(new req())
        }

        return arr
    }
}