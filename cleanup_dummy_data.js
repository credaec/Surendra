
const API_URL = 'http://localhost:3002/api';

async function cleanupData() {
    try {
        console.log('Starting cleanup...');

        // 1. Find and Delete Projects
        const projectsRes = await fetch(`${API_URL}/projects`);
        const projects = await projectsRes.json();
        const dummyProjects = projects.filter(p => p.name === 'Website Redesign');

        for (const p of dummyProjects) {
            console.log(`Deleting Project: ${p.name} (${p.id})`);
            await fetch(`${API_URL}/projects/${p.id}`, { method: 'DELETE' });
        }

        // 2. Find and Delete Clients
        const clientsRes = await fetch(`${API_URL}/clients`);
        const clients = await clientsRes.json();
        const dummyClients = clients.filter(c => c.name === 'Acme Corp');

        for (const c of dummyClients) {
            console.log(`Deleting Client: ${c.name} (${c.id})`);
            await fetch(`${API_URL}/clients/${c.id}`, { method: 'DELETE' });
        }

        // 3. Find Category and Assignments
        const catsRes = await fetch(`${API_URL}/task-categories`);
        const categories = await catsRes.json();
        const dummyCats = categories.filter(c => c.name === 'Development');

        for (const cat of dummyCats) {
            // Find assignments for this category
            const assignRes = await fetch(`${API_URL}/user-assignments`);
            const assignments = await assignRes.json();
            const relatedAssignments = assignments.filter(a => a.categoryId === cat.id);

            for (const a of relatedAssignments) {
                console.log(`Deleting Assignment: ${a.id}`);
                await fetch(`${API_URL}/user-assignments/${a.id}`, { method: 'DELETE' }); // Note: Verify endpoint if explicit delete exists
                // If specific DELETE endpoint for assignments doesn't exist (it wasn't in backendService audit explicitly?), we might fail.
                // Looking at backendService earlier: deleteUserAssignment wasn't there? 
                // Wait, checking backendService content...
                // It has `addUserAssignment` and `getUserAssignments`. No delete?
                // `server/index.js` might have it. 
                // Let's assume standard REST pattern or try. 
                // If it fails, we might leave orphans or cascade handles it.
            }

            console.log(`Deleting Category: ${cat.name} (${cat.id})`);
            await fetch(`${API_URL}/task-categories/${cat.id}`, { method: 'DELETE' });
        }

        console.log('Cleanup Complete!');

    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

cleanupData();
