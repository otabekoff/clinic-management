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
                try {
                    resolve({
                        status: res.statusCode,
                        body: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: data
                    });
                }
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
    console.log('🧪 Testing Register...');
    const regRes = await makeRequest('POST', '/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'patient'
    });
    console.log('Status:', regRes.status);
    console.log('Response:', JSON.stringify(regRes.body, null, 2));

    console.log('\n🧪 Testing Login...');
    const loginRes = await makeRequest('POST', '/auth/login', {
        email: 'test@example.com',
        password: 'password123'
    });
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginRes.body, null, 2));

    process.exit(0);
}

test().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
