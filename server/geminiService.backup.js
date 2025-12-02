const { GoogleGenerativeAI } = require('@google/generative-ai');
const fuzz = require('fuzzball');

// Lazy initialization - create client when needed, not at module load time
let genAI = null;
let model = null;
let workingModelName = null;

// Try multiple models in order of preference
const MODELS_TO_TRY = [
    'gemini-2.0-flash',           // Newest and fastest (works with your key!)
    'gemini-2.0-flash-exp',        // Experimental version
    'gemini-1.5-flash',            // Fallback
    'gemini-1.5-flash-latest',     // Alternative naming
    'gemini-1.5-pro',              // More capable but slower
    'gemini-pro'                   // Legacy
];

async function findWorkingModel() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables!');
        console.error('Please add GEMINI_API_KEY to your .env file');
        throw new Error('GEMINI_API_KEY is not configured');
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try each model until we find one that works
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`🔄 Trying model: ${modelName}...`);
            const testModel = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.5,
                }
            });

            // Test with a simple query
            const result = await testModel.generateContent('Say "test" in one word');
            await result.response;

            console.log(`✅ Successfully connected using model: ${modelName}`);
            workingModelName = modelName;
            model = testModel;
            return testModel;
        } catch (error) {
            console.log(`❌ Model ${modelName} failed: ${error.message}`);
            continue;
        }
    }

    // If no models work, throw error
    throw new Error('No working Gemini models found. Please check your API key at https://aistudio.google.com/apikey');
}

async function getModel() {
    if (!model) {
        console.log('🔍 Finding working Gemini model...');
        await findWorkingModel();
    }
    return model;
}

// Fuzzy matching threshold (85% similarity)
const FUZZY_THRESHOLD = 85;

/**
 * Checks if a brand name is mentioned in a text using fuzzy matching
 * @param {string} text - The text to search in
 * @param {string} brand - The brand name to search for
 * @returns {boolean} - True if brand is found (exact or fuzzy match)
 */
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

/**
 * Checks if a brand is mentioned in the Gemini response for a given prompt.
 * @param {string} prompt - The user's prompt.
 * @param {string} brand - The brand to check for.
 * @returns {Promise<Object>} - Result containing mention status, position, and the raw response.
 */
async function checkBrandMention(prompt, brand) {
    try {
        const model = getModel(); // Get the lazily-initialized model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const mentioned = isBrandMentioned(text, brand);
        let position = null;

        if (mentioned) {
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
                        break;
                    }
                }
            }

            // If not found in a structured list but mentioned, default to 1
            // This handles cases where the brand is mentioned in paragraphs
            if (!foundInList) {
                position = 1;
            }
        }

        return {
            mentioned,
            position,
            rawResponse: text
        };

    } catch (error) {
        console.error("\n❌ ========== GEMINI API ERROR ==========");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Error Status:", error.status || 'N/A');
        console.error("Error Code:", error.code || 'N/A');

        if (error.response) {
            console.error("API Response:", error.response);
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
