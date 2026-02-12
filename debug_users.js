import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

async function main() {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.user.findMany();
        console.log('Users in DB (via default prisma client):');
        users.forEach(u => {
            console.log(`- Email: ${u.email}`);
            console.log(`  Password Hash: ${u.password}`);
            console.log(`  Role: ${u.role}`);
        });
    } catch (e) {
        console.log('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
