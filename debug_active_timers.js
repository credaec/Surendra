
import http from 'http';

const PORT = 3004;
const TARGET_USER_ID = 'emp_01';

function request(method, path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function check() {
    try {
        console.log(`Checking specifically for user: ${TARGET_USER_ID}...`);

        const allEntries = await request('GET', `/api/time-entries?userId=${TARGET_USER_ID}`);
        console.log(`Found ${allEntries.length} total entries for ${TARGET_USER_ID}`);

        const stuck = allEntries.filter(e => !e.endTime || e.status === 'PAUSED');

        if (stuck.length > 0) {
            console.log(`FOUND ${stuck.length} STUCK TIMERS. DELETING NOW...`);
            for (const timer of stuck) {
                console.log(`Deleting ${timer.id}...`);
                await request('DELETE', `/api/time-entries/${timer.id}`);
            }
            console.log("Cleanup complete.");
        } else {
            console.log("No stuck timers found for this user.");
        }

    } catch (e) { console.error(e); }
}

check();
