
import http from 'http';

const makeRequest = (method, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3002,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body });
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

const run = async () => {
    try {
        console.log('1. Fetching Users...');
        const usersRes = await makeRequest('GET', '/api/users');
        const users = JSON.parse(usersRes.body);

        console.log('2. Fetching Projects...');
        const projectsRes = await makeRequest('GET', '/api/projects');
        const projects = JSON.parse(projectsRes.body);

        console.log('--- Analysis ---');
        console.log(`Total Users: ${users.length}`);
        console.log(`Total Projects: ${projects.length}`);

        users.forEach(user => {
            console.log(`User: ${user.name} (${user.role}) - ID: ${user.id}`);
            const assignedProjects = projects.filter(p => {
                if (!p.teamMembers || !Array.isArray(p.teamMembers)) return false;
                return p.teamMembers.some(m => m.userId === user.id);
            });

            if (assignedProjects.length > 0) {
                console.log(`  -> Assigned Projects (${assignedProjects.length}):`);
                assignedProjects.forEach(p => console.log(`     - ${p.name} (ID: ${p.id})`));
            } else {
                console.log(`  -> No Projects Assigned`);
            }
        });

        console.log('--- Raw Team Members Check ---');
        projects.forEach(p => {
            console.log(`Project: ${p.name}`);
            console.log(`TeamMembers Type: ${typeof p.teamMembers}`);
            console.log(`TeamMembers Value: ${JSON.stringify(p.teamMembers)}`);
        });

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
