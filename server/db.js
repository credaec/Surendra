import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enable SQLite Optimizations
async function optimizeDb() {
    try {
        await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
        await prisma.$executeRawUnsafe('PRAGMA synchronous = NORMAL;');
        await prisma.$executeRawUnsafe('PRAGMA temp_store = MEMORY;');
        await prisma.$executeRawUnsafe('PRAGMA cache_size = -20000;');
        console.log('SQLite optimizations enabled: WAL mode active');
    } catch (error) {
        console.error('Failed to enable SQLite optimizations:', error);
    }
}

optimizeDb();

export default prisma;
