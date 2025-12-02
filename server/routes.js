const express = require('express');
const router = express.Router();
const { checkBrandMention } = require('./geminiService');
const axios = require('axios');

// Comprehensive API key test endpoint - Using REST API
router.get('/test-gemini-key', async (req, res) => {
    const testResults = {
        timestamp: new Date().toISOString(),
        apiKeyStatus: 'unknown',
        apiKeyPreview: 'not set',
        modelsTest: [],
        finalStatus: 'unknown',
        recommendation: ''
    };

    try {
        // Step 1: Check if API key exists
        if (!process.env.GEMINI_API_KEY) {
            testResults.apiKeyStatus = 'missing';
            testResults.finalStatus = 'failed';
            testResults.recommendation = 'Add GEMINI_API_KEY to your .env file';
            return res.status(400).json(testResults);
        }

        testResults.apiKeyStatus = 'present';
        testResults.apiKeyPreview = process.env.GEMINI_API_KEY.substring(0, 20) + '...';

        // Step 2: Test multiple models using REST API
        const modelsToTest = [
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
        ];

        const apiKey = process.env.GEMINI_API_KEY;

        for (const modelName of modelsToTest) {
            const modelTest = {
                model: modelName,
                status: 'unknown',
                error: null,
                response: null,
                responseTime: null
            };

            try {
                const startTime = Date.now();
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

                const response = await axios.post(url, {
                    contents: [{
                        parts: [{
                            text: 'Say "hello" in one word'
                        }]
                    }]
                }, {
                    timeout: 10000
                });

                const endTime = Date.now();

                if (response.data && response.data.candidates && response.data.candidates.length > 0) {
                    const text = response.data.candidates[0].content.parts[0].text;
                    modelTest.status = 'success';
                    modelTest.response = text.substring(0, 100);
                    modelTest.responseTime = `${endTime - startTime}ms`;
                }
            } catch (error) {
                modelTest.status = 'failed';
                modelTest.error = error.response?.data?.error?.message || error.message;

                // Extract specific error details
                const status = error.response?.status;
                if (status === 404) {
                    modelTest.errorType = 'Model not found';
                } else if (status === 429) {
                    modelTest.errorType = 'Quota exceeded';
                } else if (status === 403) {
                    modelTest.errorType = 'Permission denied';
                } else if (status === 401) {
                    modelTest.errorType = 'Invalid API key';
                } else {
                    modelTest.errorType = 'Unknown error';
                }
            }

            testResults.modelsTest.push(modelTest);

            // If we found a working model, we can stop
            if (modelTest.status === 'success') {
                testResults.finalStatus = 'success';
                testResults.workingModel = modelName;
                testResults.recommendation = `✅ API key is working! Using model: ${modelName}`;
                break;
            }

            // Wait a bit between requests
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // If no models worked, determine the issue
        if (testResults.finalStatus !== 'success') {
            testResults.finalStatus = 'failed';

            // Check for common error patterns
            const quotaErrors = testResults.modelsTest.filter(m => m.errorType === 'Quota exceeded');
            const authErrors = testResults.modelsTest.filter(m => m.errorType === 'Invalid API key');
            const notFoundErrors = testResults.modelsTest.filter(m => m.errorType === 'Model not found');

            if (quotaErrors.length > 0) {
                testResults.recommendation = '❌ API key has quota limit = 0. Get a NEW API key from https://aistudio.google.com/apikey';
            } else if (authErrors.length > 0) {
                testResults.recommendation = '❌ Invalid API key. Check your GEMINI_API_KEY in .env file';
            } else if (notFoundErrors.length === modelsToTest.length) {
                testResults.recommendation = '❌ All models returned 404. Your API key may not have access to these models. Get a NEW key.';
            } else {
                testResults.recommendation = '❌ Unknown error. Check the error details below.';
            }
        }

        return res.json(testResults);

    } catch (error) {
        testResults.finalStatus = 'error';
        testResults.error = error.message;
        testResults.recommendation = '❌ Unexpected error occurred. Check server logs.';
        return res.status(500).json(testResults);
    }
});

// Simple test endpoint (kept for backward compatibility)
router.get('/test-api', async (req, res) => {
    try {
        const result = await checkBrandMention('Say hello', 'test');
        res.json({
            success: true,
            message: 'API is working!',
            response: result.rawResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'API test failed',
            error: error.message
        });
    }
});

router.post('/check-brand', async (req, res) => {
    let { prompt, brand } = req.body;

    if (!prompt || !brand) {
        return res.status(400).json({ error: 'Prompt and Brand are required' });
    }

    // Clean up input: remove extra quotes and trim whitespace
    prompt = prompt.trim().replace(/^["']|["']$/g, '').replace(/["']\s*\.$/, '');
    brand = brand.trim().replace(/^["']|["']$/g, '');

    try {
        const result = await checkBrandMention(prompt, brand);
        res.json(result);
    } catch (error) {
        // Should be caught in service, but just in case
        res.status(500).json({
            mentioned: false,
            position: null,
            rawResponse: "Internal Server Error (Canned Response)",
            error: true
        });
    }
});

module.exports = router;
