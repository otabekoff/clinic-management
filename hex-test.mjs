import http from 'http';

function makeRequest() {
    return new Promise((resolve) => {
        const options = {
            method: 'POST',
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = Buffer.alloc(0);
            res.on('data', chunk => {
                data = Buffer.concat([data, chunk]);
            });
            res.on('end', () => {
                console.log('Raw bytes:', data);
                console.log('Hex:', data.toString('hex'));
                console.log('UTF-8:', data.toString('utf-8'));
                console.log('Latin1:', data.toString('latin1'));
                try {
                    const json = JSON.parse(data.toString('utf-8'));
                    console.log('Parsed JSON:', json);
                } catch (e) {
                    console.log('JSON parse error:', e.message);
                }
                process.exit(0);
            });
        });

        req.on('error', err => {
            console.error('Request error:', err.message);
            process.exit(1);
        });

        req.write(JSON.stringify({
            name: 'Test',
            email: 'test@test.com',
            password: '123456',
            role: 'patient'
        }));
        req.end();
    });
}

makeRequest();
