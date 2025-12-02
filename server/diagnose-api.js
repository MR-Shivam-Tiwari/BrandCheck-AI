#!/usr/bin/env node

/**
 * Comprehensive API Key Diagnostic Tool
 * Tests different models and API versions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

console.log(`\n${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  🔬 Gemini API Comprehensive Diagnostic   ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

async function testModel(genAI, modelName) {
    try {
        console.log(`${colors.yellow}🔄 Testing: ${modelName}${colors.reset}`);

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 100,
            }
        });

        const result = await model.generateContent('Say "hello" in one word');
        const response = await result.response;
        const text = response.text();

        console.log(`${colors.green}✅ SUCCESS!${colors.reset}`);
        console.log(`   Response: "${text.trim()}"`);
        console.log('');
        return { model: modelName, status: 'success', response: text.trim() };
    } catch (error) {
        console.log(`${colors.red}❌ FAILED${colors.reset}`);
        console.log(`   Error: ${error.message.substring(0, 100)}...`);

        let errorType = 'Unknown';
        if (error.status === 404) errorType = 'Model not found (404)';
        else if (error.status === 429) errorType = 'Quota exceeded (429)';
        else if (error.status === 403) errorType = 'Permission denied (403)';
        else if (error.status === 401) errorType = 'Invalid API key (401)';

        console.log(`   Type: ${errorType}`);
        console.log('');
        return { model: modelName, status: 'failed', error: errorType };
    }
}

async function main() {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
        console.log(`${colors.red}❌ ERROR: GEMINI_API_KEY not found in .env file${colors.reset}\n`);
        process.exit(1);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`${colors.blue}📋 API Key Info:${colors.reset}`);
    console.log(`   Key: ${apiKey.substring(0, 25)}...`);
    console.log(`   Length: ${apiKey.length} characters`);
    console.log('');

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test different model names
    const modelsToTest = [
        // Newer models
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-001',

        // Experimental
        'gemini-2.0-flash-exp',

        // Legacy models
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-1.0-pro-latest',

        // Alternative naming
        'models/gemini-1.5-flash',
        'models/gemini-pro',
    ];

    console.log(`${colors.blue}🧪 Testing ${modelsToTest.length} different models...${colors.reset}\n`);

    const results = [];

    for (const modelName of modelsToTest) {
        const result = await testModel(genAI, modelName);
        results.push(result);

        // If we found a working model, we can be less aggressive
        if (result.status === 'success') {
            // Wait a bit to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            // Wait less if model failed
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // Summary
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}📊 SUMMARY${colors.reset}\n`);

    const successes = results.filter(r => r.status === 'success');
    const failures = results.filter(r => r.status === 'failed');

    if (successes.length > 0) {
        console.log(`${colors.green}✅ Working Models (${successes.length}):${colors.reset}`);
        successes.forEach(s => {
            console.log(`   - ${s.model}`);
        });
        console.log('');

        console.log(`${colors.green}🎉 GOOD NEWS: Your API key is working!${colors.reset}\n`);
        console.log(`${colors.yellow}📝 Recommendation:${colors.reset}`);
        console.log(`   Use this model in your code: ${colors.cyan}${successes[0].model}${colors.reset}\n`);

        // Show code to update
        console.log(`${colors.blue}Update server/geminiService.js:${colors.reset}`);
        console.log(`   Change line ~30 to:`);
        console.log(`   ${colors.cyan}model: '${successes[0].model}'${colors.reset}\n`);
    } else {
        console.log(`${colors.red}❌ No working models found (0/${modelsToTest.length})${colors.reset}\n`);

        // Analyze errors
        const quotaErrors = failures.filter(f => f.error.includes('Quota'));
        const notFoundErrors = failures.filter(f => f.error.includes('not found'));
        const authErrors = failures.filter(f => f.error.includes('Invalid'));

        console.log(`${colors.yellow}📊 Error Breakdown:${colors.reset}`);
        console.log(`   - Quota exceeded: ${quotaErrors.length}`);
        console.log(`   - Model not found (404): ${notFoundErrors.length}`);
        console.log(`   - Auth errors: ${authErrors.length}`);
        console.log(`   - Other errors: ${failures.length - quotaErrors.length - notFoundErrors.length - authErrors.length}`);
        console.log('');

        if (quotaErrors.length > 0) {
            console.log(`${colors.red}⚠️  Your API key has quota limit = 0${colors.reset}`);
            console.log(`${colors.yellow}This means your API key is not properly activated.${colors.reset}\n`);
        }

        if (notFoundErrors.length === failures.length) {
            console.log(`${colors.red}⚠️  All models returned 404 Not Found${colors.reset}`);
            console.log(`${colors.yellow}This usually means:${colors.reset}`);
            console.log(`   1. Your API key doesn't have access to Gemini API`);
            console.log(`   2. The API might not be enabled in your Google Cloud project`);
            console.log(`   3. You might need to enable the Generative Language API\n`);
        }

        console.log(`${colors.cyan}🔧 NEXT STEPS:${colors.reset}\n`);
        console.log(`1. Go to: ${colors.cyan}https://aistudio.google.com/apikey${colors.reset}`);
        console.log(`2. Try to use the API in Google AI Studio first`);
        console.log(`3. Make sure you can generate content there`);
        console.log(`4. If it works there, copy the EXACT same API key`);
        console.log(`5. Or try: ${colors.cyan}https://makersuite.google.com/app/prompts/new_freeform${colors.reset}`);
        console.log(`6. Generate something, then copy your API key from there\n`);
    }

    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

main().catch(error => {
    console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error);
    process.exit(1);
});
