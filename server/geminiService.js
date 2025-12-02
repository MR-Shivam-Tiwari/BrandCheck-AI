const axios = require('axios');
const fuzz = require('fuzzball');

 
// This is one of the most cost-effective models currently available
const GEMINI_MODEL = 'gemini-2.0-flash';

// Temperature: 0.5 (Balanced for creativity and accuracy)
const TEMPERATURE = 0.5;

// Fuzzy matching threshold (85% similarity)
const FUZZY_THRESHOLD = 85;
 
async function callGeminiAPI(prompt) {
    // Build API URL with least expensive model
    const apiUrl = process.env.GEMINI_API_URL ||
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    if (!apiUrl && !process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_URL or GEMINI_API_KEY is not configured');
    }

    // Payload with temperature configuration
    const payload = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: 2048,
        }
    };

    console.log(`🔄 Calling Gemini API...`);
    console.log(`📍 URL: ${apiUrl.substring(0, 80)}...`);

    try {
        // Using axios (similar to fetch in react-ai-tool)
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        // Parse response exactly like react-ai-tool (App.jsx line 50)
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const text = response.data.candidates[0].content.parts[0].text;
            console.log(` Success! Response received (${text.length} characters)`);
            return text;
        } else {
            throw new Error('Invalid response structure from Gemini API');
        }
    } catch (error) {
        console.error(` API call failed:`, error.response?.data?.error?.message || error.message);
        throw error;
    }
}

 
function isBrandMentioned(text, brand) {
    const lowerText = text.toLowerCase();
    const lowerBrand = brand.toLowerCase();

    // Check exact match first
    if (lowerText.includes(lowerBrand)) {
        return true;
    }

    // Check fuzzy match by splitting text into words and comparing
    const words = lowerText.split(/\s+/);

    // Check single word match
    for (const word of words) {
        const cleanWord = word.replace(/[^\w]/g, ''); // Remove punctuation
        const ratio = fuzz.ratio(cleanWord, lowerBrand);
        if (ratio >= FUZZY_THRESHOLD) {
            return true;
        }
    }

    // Check multi-word phrases (for brands like "mail chimp" vs "mailchimp")
    const brandWords = lowerBrand.split(/\s+/);
    if (brandWords.length > 1) {
        // Try to find the brand as a phrase
        for (let i = 0; i <= words.length - brandWords.length; i++) {
            const phrase = words.slice(i, i + brandWords.length).join(' ');
            const cleanPhrase = phrase.replace(/[^\w\s]/g, '');
            const ratio = fuzz.ratio(cleanPhrase, lowerBrand);
            if (ratio >= FUZZY_THRESHOLD) {
                return true;
            }
        }
    }

    // Check if brand without spaces matches any word
    const brandNoSpaces = lowerBrand.replace(/\s+/g, '');
    for (const word of words) {
        const cleanWord = word.replace(/[^\w]/g, '');
        const ratio = fuzz.ratio(cleanWord, brandNoSpaces);
        if (ratio >= FUZZY_THRESHOLD) {
            return true;
        }
    }

    return false;
}

 
async function checkBrandMention(prompt, brand) {
    try {
        console.log('\n🔍 Checking brand mention...');
        console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
        console.log(`🏷️  Brand: ${brand}`);

        // Call Gemini API (exactly like react-ai-tool's askQuestion function)
        const text = await callGeminiAPI(prompt);

        console.log(`📄 Response received (${text.length} characters)`);

        const mentioned = isBrandMentioned(text, brand);
        let position = null;

        if (mentioned) {
            console.log(` Brand "${brand}" is mentioned!`);

            // Attempt to determine position in a list
            const lines = text.split('\n');
            let currentPosition = 0;
            let foundInList = false;

            for (const line of lines) {
                // Check if line is a list item (starts with number or bullet)
                const isListItem = /^\s*(\d+\.|-|\*)\s+/.test(line);

                if (isListItem) {
                    currentPosition++;
                    // Use fuzzy matching to check if brand is in this line
                    if (isBrandMentioned(line, brand)) {
                        position = currentPosition;
                        foundInList = true;
                        console.log(`📍 Found at position: ${position}`);
                        break;
                    }
                }
            }

          
            if (!foundInList) {
                position = 1;
                console.log(`📍 Position set to: ${position} (not in a numbered list)`);
            }
        } else {
            console.log(` Brand "${brand}" is NOT mentioned`);
        }

        return {
            mentioned,
            position,
            rawResponse: text
        };

    } catch (error) {
        console.error("\n ========== GEMINI API ERROR ==========");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);

        if (error.response) {
            console.error("API Response Status:", error.response.status);
            console.error("API Response Data:", JSON.stringify(error.response.data, null, 2));
        }

        if (error.stack) {
            console.error("Stack Trace:", error.stack);
        }
        console.error("========================================\n");

        // Return canned response as per requirements
        return {
            mentioned: false,
            position: null,
            rawResponse: "Service is currently unavailable. This is a canned response.",
            error: true
        };
    }
}

module.exports = { checkBrandMention };
