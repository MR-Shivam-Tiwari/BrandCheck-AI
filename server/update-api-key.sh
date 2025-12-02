#!/bin/bash
echo "==================================="
echo "  Gemini API Key Update Script"
echo "==================================="
echo ""
echo "Please enter your NEW Gemini API key:"
read -r api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided. Exiting."
    exit 1
fi

# Update .env file
cat > .env << EOL
# Gemini API Configuration
GEMINI_API_KEY=$api_key

# Server Configuration
PORT=8000
EOL

echo ""
echo "✅ API key updated in .env file!"
echo ""
echo "Now testing the API key..."
echo ""

# Test the API key
node -e "
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(\`🔄 Testing model: \${modelName}...\`);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log(\`✅ SUCCESS! Model \${modelName} is working!\`);
      console.log('Response:', response.text());
      console.log('');
      console.log('✅ Your API key is configured correctly!');
      return;
    } catch (error) {
      console.log(\`   ❌ \${modelName} failed\`);
    }
  }
  console.log('');
  console.log('❌ All models failed. Please check:');
  console.log('   1. API key is valid');
  console.log('   2. API key has proper permissions');
  console.log('   3. Visit: https://aistudio.google.com/apikey');
}
test();
"
