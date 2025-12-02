// Test script to verify Gemini API connection
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('\n🔍 Testing Gemini API Connection...\n');

// Check if API key is loaded
console.log('1. Checking API Key:');
if (!process.env.GEMINI_API_KEY) {
    console.error('    GEMINI_API_KEY is NOT set!');
    process.exit(1);
} else {
    console.log('    API Key is loaded');
    console.log('   📝 Key starts with:', process.env.GEMINI_API_KEY.substring(0, 20) + '...');
}

// Try to initialize the API
console.log('\n2. Initializing Gemini API:');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log('    API client initialized');

// Try different model names
const modelsToTry = ['gemini-pro', 'gemini-1.5-pro-latest', 'gemini-1.5-pro', 'gemini-1.5-flash'];

console.log('\n3. Testing different model names:\n');

async function testModel(modelName) {
    try {
        console.log(`   🔄 Trying: ${modelName}`);
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.5,
            }
        });

        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();

        console.log(`    SUCCESS with ${modelName}!`);
        console.log(`   📥 Response: ${text}\n`);
        return modelName;
    } catch (error) {
        console.log(`    Failed: ${error.message.substring(0, 80)}...\n`);
        return null;
    }
}

(async () => {
    let workingModel = null;

    for (const modelName of modelsToTry) {
        workingModel = await testModel(modelName);
        if (workingModel) {
            console.log(`\n SUCCESS! Use this model name: "${workingModel}"\n`);
            console.log(`📝 Update your geminiService.js to use: model: '${workingModel}'\n`);
            process.exit(0);
        }
    }

    console.log('\n None of the models worked. Possible issues:');
    console.log('   1. API key may be invalid or expired'); 
    process.exit(1);
})();
