import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('employee123', 10);

    const employee = await prisma.user.upsert({
        where: { email: 'employee@localhost.com' },
        update: {
            password: hashedPassword,
            role: 'EMPLOYEE'
        },
        create: {
            id: 'emp_01',
            name: 'Test Employee',
            email: 'employee@localhost.com',
            password: hashedPassword,
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            avatarInitials: 'TE'
        }
    });

    console.log('Employee created/updated:');
    console.log('Email: employee@localhost.com');
    console.log('Password: employee123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
