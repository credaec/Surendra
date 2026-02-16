
import http from 'http';

const PORT = 3004;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function cleanup() {
    try {
        console.log("Fetching Users...");
        const users = await request('GET', '/api/users');
        const user = users[0];
        console.log(`Cleaning up for user: ${user.name} (${user.id})`);

        const allEntries = await request('GET', `/api/time-entries?userId=${user.id}`);
        const active = allEntries.filter(e => !e.endTime);

        console.log(`Found ${active.length} active timers.`);

        for (const t of active) {
            console.log(`Stopping timer ${t.id}...`);
            const now = new Date().toISOString();
            // Just patch it to have an end time and status SUBMITTED so it stops showing up active
            const update = {
                ...t,
                endTime: now,
                status: 'SUBMITTED',
                durationMinutes: Math.floor((Date.now() - new Date(t.startTime).getTime()) / 60000)
            };
            // Remove transients
            delete update.user; delete update.project; delete update.category; delete update.task;

            await request('PUT', `/api/time-entries/${t.id}`, update);
            console.log(`Stopped ${t.id}`);
        }
        console.log("Cleanup complete.");

    } catch (e) { console.error(e); }
}

cleanup();
