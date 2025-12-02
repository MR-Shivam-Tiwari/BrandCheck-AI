// Script to list all available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('\n📋 Listing Available Gemini Models...\n');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        const models = await genAI.listModels();

        console.log('✅ Found', models.length, 'models:\n');

        models.forEach((model, index) => {
            console.log(`${index + 1}. ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
            console.log('');
        });

        console.log('\n💡 Use the model name without the "models/" prefix in your code.\n');
    } catch (error) {
        console.error('❌ Error listing models:', error.message);

        if (error.message.includes('API_KEY_INVALID')) {
            console.error('\n💡 Your API key appears to be invalid.');
            console.error('   Please generate a new one at: https://aistudio.google.com/apikey\n');
        }
    }
})();
