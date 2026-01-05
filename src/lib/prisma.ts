import { PrismaClient } from '@prisma/client'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const prismaClientSingleton = () => {
    const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
    const dbPath = databaseUrl.replace(/^file:/, '')

    const connection = new Database(dbPath)
    // @ts-ignore
    const adapter = new PrismaBetterSqlite3(connection)

    return new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
