
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@localhost.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword, role: 'ADMIN' },
        create: {
            id: 'admin_01',
            name: 'Admin User',
            email,
            password: hashedPassword,
            role: 'ADMIN',
            designation: 'Administrator',
            department: 'IT',
            status: 'ACTIVE',
            avatarInitials: 'AD'
        }
    });

    console.log(`Password for ${email} has been reset to: ${password}`);
    console.log('User details:', JSON.stringify(user, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
