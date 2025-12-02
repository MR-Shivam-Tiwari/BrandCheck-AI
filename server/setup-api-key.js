#!/usr/bin/env node
// Interactive script to set up and test a new Gemini API key
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     Gemini API Key Setup & Test Utility                ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('📋 Instructions:');
console.log('1. Go to: https://aistudio.google.com/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API key" or "Get API key"');
console.log('4. Copy the entire API key (starts with "AIza...")\n');

rl.question('🔑 Paste your NEW API key here: ', async (apiKey) => {

  const trimmedKey = apiKey.trim();

  if (!trimmedKey) {
    console.log('\n❌ No API key provided. Exiting.\n');
    rl.close();
    return;
  }

  if (!trimmedKey.startsWith('AIza')) {
    console.log('\n⚠️  WARNING: API key should start with "AIza"');
    console.log('   Your key starts with:', trimmedKey.substring(0, 10));
    console.log('   Make sure you copied the correct key!\n');
  }

  console.log('\n✅ API key received');
  console.log('📝 Key starts with:', trimmedKey.substring(0, 20) + '...\n');

  // Test the API key
  console.log('🔄 Testing API key with Gemini...\n');

  const modelsToTry = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'];

  let workingModel = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`   Testing: ${modelName}...`);
      const genAI = new GoogleGenerativeAI(trimmedKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.5 }
      });

      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      const text = response.text();

      console.log(`   ✅ SUCCESS with ${modelName}!`);
      console.log(`   📥 Response: ${text}\n`);
      workingModel = modelName;
      break;
    } catch (error) {
      console.log(`   ❌ Failed with ${modelName}`);
    }
  }

  if (!workingModel) {
    console.log('\n❌ ERROR: API key is not working with any model!');
    console.log('\n💡 Possible issues:');
    console.log('   1. The API key is invalid or expired');
    console.log('   2. The API key doesn\'t have access to Gemini models');
    console.log('   3. You may need to enable the Gemini API in Google Cloud Console');
    console.log('\n🔗 Try generating a new key at: https://aistudio.google.com/apikey\n');
    rl.close();
    return;
  }

  // Update .env file
  console.log('💾 Updating .env file...\n');

  const envPath = path.join(__dirname, '.env');
  const envContent = `GEMINI_API_KEY=${trimmedKey}\nPORT=8000\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!\n');
  } catch (error) {
    console.log('❌ Error writing .env file:', error.message);
    console.log('\n📝 Please manually update your .env file:');
    console.log(`   GEMINI_API_KEY=${trimmedKey}`);
    console.log('   PORT=8000\n');
    rl.close();
    return;
  }

  // Update geminiService.js with working model
  console.log(`🔧 Updating geminiService.js to use: ${workingModel}\n`);

  const servicePath = path.join(__dirname, 'geminiService.js');
  try {
    let serviceContent = fs.readFileSync(servicePath, 'utf8');

    // Replace model name
    serviceContent = serviceContent.replace(
      /model: ['"]gemini-[^'"]+['"]/,
      `model: '${workingModel}'`
    );

    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ geminiService.js updated successfully!\n');
  } catch (error) {
    console.log('⚠️  Could not update geminiService.js automatically');
    console.log(`   Please manually set model to: '${workingModel}'\n`);
  }

  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                 🎉 SETUP COMPLETE! 🎉                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('✅ Your API key is working!');
  console.log(`✅ Using model: ${workingModel}`);
  console.log('✅ Configuration saved to .env\n');

  console.log('🚀 Next steps:');
  console.log('   1. Restart your backend server:');
  console.log('      npm start\n');
  console.log('   2. Test your app at: http://localhost:5173\n');

  rl.close();
});
