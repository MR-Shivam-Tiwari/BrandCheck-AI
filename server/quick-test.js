#!/usr/bin/env node

/**
 * Quick visual test for Gemini API key
 * Run: node quick-test.js
 */

const http = require('http');

console.log('\n🔍 Testing Gemini API Key...\n');

const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/test-gemini-key',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const result = JSON.parse(data);

          

            // Status
            if (result.finalStatus === 'success') {
                console.log(' STATUS: SUCCESS\n');
                console.log(` Your API key is working!`);
                console.log(`📦 Using model: ${result.workingModel}\n`);
                console.log(`You can now use the application!`);
                console.log(`Test with:`);
                console.log(`  - Prompt: "Give a list of best marketing analytics tools"`);
                console.log(`  - Brand: "Matomo"\n`);
            } else {
                console.log(' STATUS: FAILED\n');
                console.log(`${result.recommendation}\n`);

                if (result.apiKeyPreview && result.apiKeyPreview !== 'not set') {
                    console.log(`Current API Key: ${result.apiKeyPreview}\n`);
                }

                // Show detailed errors
                if (result.modelsTest && result.modelsTest.length > 0) {
                    console.log('📋 Models Tested:');
                    result.modelsTest.forEach((test, idx) => {
                        const icon = test.status === 'success' ? '' : '';
                        console.log(`  ${idx + 1}. ${icon} ${test.model}: ${test.errorType || test.status}`);
                    });
                    console.log('');
                }

                // Next steps
                console.log('🔧 NEXT STEPS:');
                console.log('  1. Go to: https://aistudio.google.com/apikey');
                console.log('  2. Delete your old API key');
                console.log('  3. Create a NEW API key in a new project');
                console.log('  4. Copy the new API key');
                console.log('  5. Update your .env file:');
                console.log('     cd server');
                console.log('     nano .env');
                console.log('     (Replace GEMINI_API_KEY with new key)');
                console.log('  6. Restart server: npm start');
                console.log('  7. Run this test again: node quick-test.js\n');
            } 

        } catch (error) {
            console.error(' Error parsing response:', error.message);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error(' ERROR: Could not connect to server\n');
    console.log('Make sure your server is running:');
    console.log('  cd server');
    console.log('  npm start\n');
    console.log('Then run this test again: node quick-test.js\n');
});

req.end();
