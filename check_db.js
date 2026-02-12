import { PrismaClient } from '@prisma/client';

async function check(url) {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });
    try {
        const users = await prisma.user.findMany();
        console.log(`URL: ${url}`);
        console.log('Users:', users.map(u => u.email));
    } catch (e) {
        console.log(`URL: ${url} failed: ${e.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    await check('file:./dev.db');
    await check('file:./prisma/dev.db');
}

main();
