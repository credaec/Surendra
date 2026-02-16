
import http from 'http';

const PORT = 3004;
const TIMER_ID = 'time_1770811216163';

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

async function fix() {
    console.log(`Deleting zombie timer: ${TIMER_ID}...`);
    try {
        const result = await request('DELETE', `/api/time-entries/${TIMER_ID}`);
        console.log('Delete result:', result);
    } catch (e) {
        console.error('Error deleting timer:', e);
    }
}

fix();
