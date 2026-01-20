#!/usr/bin/env node

/**
 * API Test Script for Clinic Management System
 * Tests all endpoints with real HTTP requests
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000/api';

let testsPassed = 0;
let testsFailed = 0;
let authToken = null;
let userId = null;

// Helper function for HTTP requests
function makeRequest(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

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

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        testsFailed++;
    }
}

async function runTests() {
    console.log('🧪 Starting API Tests...\n');

    // Test: Register
    await test('Register new user', async () => {
        const response = await makeRequest('POST', '/auth/register', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'patient'
        });

        if (response.status !== 201) {
            throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
        }

        if (!response.body.id || !response.body.name) {
            throw new Error('Invalid response body');
        }

        userId = response.body.id;
    });

    // Test: Register with invalid email
    await test('Register with invalid email should fail', async () => {
        const response = await makeRequest('POST', '/auth/register', {
            name: 'Test User 2',
            email: 'invalid-email',
            password: 'password123',
            role: 'patient'
        });

        if (response.status === 201) {
            throw new Error('Should have rejected invalid email');
        }
    });

    // Test: Register with duplicate email
    await test('Register with duplicate email should fail', async () => {
        const response = await makeRequest('POST', '/auth/register', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'patient'
        });

        if (response.status === 201) {
            throw new Error('Should have rejected duplicate email');
        }
    });

    // Test: Login
    await test('Login with valid credentials', async () => {
        const response = await makeRequest('POST', '/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });

        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}: ${JSON.stringify(response.body)}`);
        }

        if (!response.body.token) {
            throw new Error('No token in response');
        }

        authToken = response.body.token;
    });

    // Test: Login with invalid password
    await test('Login with invalid password should fail', async () => {
        const response = await makeRequest('POST', '/auth/login', {
            email: 'test@example.com',
            password: 'wrongpassword'
        });

        if (response.status === 200) {
            throw new Error('Should have rejected invalid password');
        }
    });

    // Test: Get profile (requires auth)
    await test('Get user profile with valid token', async () => {
        const response = await makeRequest('GET', '/auth/profile', null, authToken);

        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}: ${JSON.stringify(response.body)}`);
        }

        if (!response.body.id || response.body.email !== 'test@example.com') {
            throw new Error('Invalid profile data');
        }
    });

    // Test: Get profile without token
    await test('Get profile without token should fail', async () => {
        const response = await makeRequest('GET', '/auth/profile');

        if (response.status === 200) {
            throw new Error('Should have rejected request without token');
        }
    });

    // Test: Get all users (admin only)
    await test('Get all users should fail without admin role', async () => {
        const response = await makeRequest('GET', '/users/', null, authToken);

        if (response.status === 200) {
            throw new Error('Should have rejected non-admin user');
        }
    });

    console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    process.exit(testsFailed > 0 ? 1 : 0);
}

// Wait a moment for server to start, then run tests
setTimeout(runTests, 2000);
