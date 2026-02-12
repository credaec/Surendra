import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('User count:', users.length);
    console.log(users.map(u => u.name));
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
