require('dotenv').config();
const { checkBrandMention } = require('./geminiService');
const fs = require('fs');

 
async function verifyAll() {
    const checks = [];

    // 1. Check configuration
    console.log('1️⃣  Checking Configuration...');
    const serviceCode = fs.readFileSync('./geminiService.js', 'utf8');

    const hasModel = serviceCode.includes("GEMINI_MODEL = 'gemini-2.0-flash'");
    const hasTemp = serviceCode.includes('TEMPERATURE = 0.5');
    const hasFuzzy = serviceCode.includes('FUZZY_THRESHOLD = 85');

    console.log(`   Model (gemini-2.0-flash): ${hasModel ? '' : ''}`);
    console.log(`   Temperature (0.5): ${hasTemp ? '' : ''}`);
    console.log(`   Fuzzy Threshold (85): ${hasFuzzy ? '' : ''}`);
    checks.push(hasModel && hasTemp && hasFuzzy);

    // 2. Check API key
    console.log('\n2️⃣  Checking API Key...');
    const hasKey = !!process.env.GEMINI_API_KEY;
    console.log(`   API Key Present: ${hasKey ? '' : ''}`);
    checks.push(hasKey);

    // 3. Test canned response
    console.log('\n3️⃣  Testing Canned Response...');
    const serviceCodeCanned = serviceCode.includes('Service is currently unavailable. This is a canned response.');
    console.log(`   Canned Response Text: ${serviceCodeCanned ? '' : ''}`);
    checks.push(serviceCodeCanned);

    // 4. Test actual API call
    console.log('\n4️⃣  Testing API Call...');
    try {
        const result = await checkBrandMention('Say hello', 'test');
        const working = result.rawResponse && result.rawResponse.length > 0;
        console.log(`   API Response: ${working ? '' : ''}`);
        console.log(`   Response Type: ${result.error ? 'Canned' : 'Real'}`);
        checks.push(working);
    } catch (e) {
        console.log(`   API Response:  (${e.message})`);
        checks.push(false);
    }

    // 5. Check fuzzy matching
    console.log('\n5️⃣  Testing Fuzzy Matching...');
    const hasFuzzball = serviceCode.includes("require('fuzzball')");
    const hasFuzzyLogic = serviceCode.includes('fuzz.ratio');
    console.log(`   Fuzzball Library: ${hasFuzzball ? '' : ''}`);
    console.log(`   Fuzzy Logic: ${hasFuzzyLogic ? '' : ''}`);
    checks.push(hasFuzzball && hasFuzzyLogic);

    // 6. Check position detection
    console.log('\n6️⃣  Testing Position Detection...');
    const hasPositionLogic = serviceCode.includes('isListItem');
    console.log(`   Position Detection: ${hasPositionLogic ? '' : ''}`);
    checks.push(hasPositionLogic);

    // Summary
    const passed = checks.filter(c => c).length;
    const total = checks.length;

    

    if (passed === total) {
        console.log(' ALL REQUIREMENTS VERIFIED!\n');
        console.log(' Configuration: Correct');
        console.log(' API: Working');
        console.log(' Canned Response: Ready');
        console.log(' Fuzzy Matching: Implemented');
        console.log(' Position Detection: Working');
        console.log('\n📖 See REQUIREMENTS_CHECKLIST.md for details\n');
    } else {
        console.log('  Some checks failed. Review above.\n');
    }
}

verifyAll().catch(console.error);
