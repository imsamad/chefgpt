import { PrismaClient } from "@prisma/client";

const _prismaClient = () => new PrismaClient()

declare const globalThis: {
  prismaInstance:  ReturnType<typeof _prismaClient>
} & typeof global

export const prismaClient = globalThis.prismaInstance ?? _prismaClient()

if (process.env.NODE_ENV != "production") globalThis.prismaInstance = prismaClient
