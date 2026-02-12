
const API_URL = 'http://localhost:3002/api';

async function createData() {
    try {
        console.log('Fetching users...');
        const usersRes = await fetch(`${API_URL}/users`);
        const users = await usersRes.json();
        const employee = users.find(u => u.role === 'EMPLOYEE');
        if (!employee) {
            console.error('No EMPLOYEE found to assign to. Please create an employee first.');
            process.exit(1);
        }
        console.log(`Found Employee: ${employee.name} (${employee.id})`);

        // 1. Create Client
        console.log('Creating Client...');
        const clientRes = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `client_${Date.now()}`,
                name: 'Acme Corp',
                email: 'contact@acme.com',
                phone: '555-0100',
                companyName: 'Acme Corporation', // FIXED: company -> companyName
                status: 'ACTIVE'
            })
        });

        if (!clientRes.ok) {
            const err = await clientRes.text();
            console.error('Failed to create client:', err);
            return;
        }
        const client = await clientRes.json();
        console.log(`Client Created: ${JSON.stringify(client)}`);

        // 2. Create Task Category
        console.log('Creating Task Category...');
        const catRes = await fetch(`${API_URL}/task-categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `cat_${Date.now()}`,
                name: 'Development',
                isBillable: true
            })
        });
        if (!catRes.ok) {
            const err = await catRes.text();
            console.error('Failed to create category:', err);
            return;
        }
        const category = await catRes.json();
        console.log(`Category Created: ${category.name} (${category.id})`);

        // 3. Create Project
        console.log('Creating Project...');
        const projRes = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `proj_${Date.now()}`,
                code: `WEB_REDESIGN_${Date.now()}`,
                name: 'Website Redesign',
                clientId: client.id,
                clientName: client.name,
                status: 'ACTIVE',
                description: 'Full redesign of corporate website',
                startDate: new Date().toISOString(),
                billingMode: 'HOURLY',
                rateLogic: 'FLAT_RATE',
                budgetAmount: 50000,
                estimatedHours: 1000,
                teamMembers: [employee.id]
            })
        });
        if (!projRes.ok) {
            const err = await projRes.text();
            console.error('Failed to create project:', err);
            return;
        }
        const project = await projRes.json();
        console.log(`Project Created: ${project.name} (${project.id})`);

        // 4. Create User Assignment 
        console.log('Assigning Category to User...');
        const assignRes = await fetch(`${API_URL}/user-assignments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `ua_${Date.now()}`,
                userId: employee.id,
                categoryId: category.id,
                assignedBy: 'system',
                assignedAt: new Date().toISOString()
            })
        });
        if (!assignRes.ok) {
            const err = await assignRes.text();
            console.error('Failed to create assignment:', err);
            return;
        }
        const assignment = await assignRes.json();
        console.log(`Assignment Created: ${assignment.id}`);

        console.log('Dummy Data Creation Complete!');

    } catch (error) {
        console.error('Error creating data:', error);
    }
}

createData();
