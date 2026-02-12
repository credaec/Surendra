
try {
    const res = await fetch('http://localhost:3002/api/audit');
    console.log('Status:', res.status);
    const contentType = res.headers.get('content-type');
    console.log('Content-Type:', contentType);

    const text = await res.text();
    try {
        const json = JSON.parse(text);
        console.log('Is Array:', Array.isArray(json));
        if (!Array.isArray(json)) {
            console.log('Type:', typeof json);
            console.log('Content:', JSON.stringify(json, null, 2));
        } else {
            console.log('Array Length:', json.length);
            if (json.length > 0) console.log('First item keys:', Object.keys(json[0]));
        }
    } catch (e) {
        console.log('Response is not JSON:', text.substring(0, 500));
    }
} catch (err) {
    console.error('Fetch Error:', err.message);
}
