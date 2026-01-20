import app from './src/app/app.js';

const PORT = 3000;

// Simple test
console.log('App imported successfully');
console.log('App type:', typeof app);

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    
    // Now test a request
    import('http').then(({ default: http }) => {
        const options = {
            method: 'POST',
            hostname: 'localhost',
            port: PORT,
            path: '/api/auth/register',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                console.log('Status:', res.statusCode);
                console.log('Response:', data);
                process.exit(0);
            });
        });

        req.on('error', err => {
            console.error('Request error:', err);
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
});
