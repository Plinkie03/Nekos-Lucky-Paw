import { Prisma, PrismaClient } from "@prisma/client";

const GiveawayIncludes = {
    requirements: true
}

export type RawGiveawayData = Exclude<Awaited<ReturnType<NekoDatabase["getRawGiveaway"]>>, null>
export type RawRequirementData = Exclude<Awaited<ReturnType<NekoDatabase["getRawRequirements"]>>, null>[number]
export type RawParticipantData = Exclude<Awaited<ReturnType<NekoDatabase["getRawParticipant"]>>, null>

class NekoDatabase extends PrismaClient {
    public getRawGiveaway(giveawayId: string) {
        return this.rawGiveaway.findUnique({
            where: {
                uuid: giveawayId
            },
            include: GiveawayIncludes
        })
    }

    public getRawParticipants(giveawayId: string) {
        return this.rawParticipant.findMany({
            where: {
                giveawayId
            }
        })
    }

    public getRawParticipant(giveawayId: string, userId: string) {
        return this.rawParticipant.findFirst({
            where: {
                giveawayId,
                userId
            }
        })
    }

    public getRawRequirements(giveawayId: string) {
        return this.rawRequirement.findMany({
            where: {
                giveawayId
            }
        })
    }

    public createRawGiveaway(data: Prisma.RawGiveawayCreateInput & { requirements: Prisma.RawRequirementCreateManyGiveawayInput  }) {
        return this.rawGiveaway.create({
            data: {
                ...data,
                requirements: {
                    createMany: {
                        data: data.requirements
                    }
                }
            },
            include: GiveawayIncludes
        })
    }

    public deleteRawGiveaway(giveawayId: string) {
        return this.rawGiveaway.delete({
            where: {
                uuid: giveawayId
            }
        })
    }
}

export default new NekoDatabase()