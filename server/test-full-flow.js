#!/usr/bin/env node

/**
 * Complete test script for the Brand Mention Checker
 * Tests API connection, backend service, and sample queries
 */

require('dotenv').config();
const { checkBrandMention } = require('./geminiService');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(color, symbol, message) {
    console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function testCase(testNum, prompt, brand) {
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}📋 Test Case ${testNum}${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`Prompt: "${prompt}"`);
    console.log(`Brand: "${brand}"`);
    console.log('');

    try {
        log(colors.yellow, '⏳', 'Sending request to Gemini API...');
        const result = await checkBrandMention(prompt, brand);

        if (result.error) {
            log(colors.red, '❌', 'API returned an error');
            console.log('\nResponse:', JSON.stringify(result, null, 2));
            return false;
        }

        log(colors.green, '✅', 'Request successful!');
        console.log('');
        console.log(`${colors.green}Results:${colors.reset}`);
        console.log(`  • Mentioned: ${result.mentioned ? colors.green + 'YES' : colors.red + 'NO'}${colors.reset}`);
        console.log(`  • Position: ${result.position || 'N/A'}`);
        console.log('');
        console.log(`${colors.cyan}Gemini Response:${colors.reset}`);
        console.log('─────────────────────────────────────────');
        console.log(result.rawResponse.substring(0, 500) + (result.rawResponse.length > 500 ? '...' : ''));
        console.log('─────────────────────────────────────────');

        return true;
    } catch (error) {
        log(colors.red, '❌', `Test failed: ${error.message}`);
        console.error(error);
        return false;
    }
}

async function main() {
    console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║  🧪 Brand Mention Checker - Full Test Suite  ║${colors.reset}`);
    console.log(`${colors.cyan}╚═══════════════════════════════════════════════╝${colors.reset}\n`);

    // Check API key
    log(colors.blue, '🔍', 'Checking configuration...');
    if (!process.env.GEMINI_API_KEY) {
        log(colors.red, '❌', 'GEMINI_API_KEY not found in .env file');
        console.log('\nPlease set your API key in the .env file:');
        console.log('  GEMINI_API_KEY=your_api_key_here\n');
        process.exit(1);
    }

    const keyPreview = process.env.GEMINI_API_KEY.substring(0, 20) + '...';
    log(colors.green, '✅', `API Key loaded: ${keyPreview}`);

    // Test cases from requirements
    const tests = [
        {
            prompt: 'Give a list of best marketing analytics tools',
            brand: 'Matomo'
        },
        {
            prompt: 'what are some good and cost effective email marketing platforms for small businesses',
            brand: 'mailchimp'
        }
    ];

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
        const success = await testCase(i + 1, tests[i].prompt, tests[i].brand);
        if (success) {
            passed++;
        } else {
            failed++;
        }

        // Wait a bit between requests to avoid rate limiting
        if (i < tests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Summary
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}📊 Test Summary${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    log(colors.green, '✅', `Passed: ${passed}/${tests.length}`);
    if (failed > 0) {
        log(colors.red, '❌', `Failed: ${failed}/${tests.length}`);
    }
    console.log('');

    if (passed === tests.length) {
        log(colors.green, '🎉', 'All tests passed! Your API is working correctly.');
        console.log('\nYou can now start your server:');
        console.log(`  ${colors.cyan}npm start${colors.reset}\n`);
    } else {
        log(colors.yellow, '⚠️', 'Some tests failed. Please check your API key and try again.');
        console.log('\nTroubleshooting steps:');
        console.log('  1. Verify your API key at https://aistudio.google.com/apikey');
        console.log('  2. Make sure you have quota available');
        console.log('  3. Check the error messages above');
        console.log('  4. Refer to SETUP_GUIDE.md for detailed instructions\n');
    }
}

// Run tests
main().catch(error => {
    console.error(`\n${colors.red}❌ Fatal error:${colors.reset}`, error);
    process.exit(1);
});
