import http from 'http';

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            hostname: 'localhost',
            port: 3000,
            path: `/api${path}`,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: data,
                    bodyParsed: (() => { try { return JSON.parse(data); } catch { return null; } })()
                });
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function test() {
    try {
        console.log('🧪 Testing Register...');
        const regRes = await makeRequest('POST', '/auth/register', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'patient'
        });
        console.log('Status:', regRes.status);
        console.log('Body:', regRes.body);
        console.log('Parsed:', regRes.bodyParsed);
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);
    }
    process.exit(0);
}

setTimeout(test, 1000);
