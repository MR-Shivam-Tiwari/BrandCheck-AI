const express = require('express');
const router = express.Router();
const { checkBrandMention } = require('./geminiService');

router.post('/check-brand', async (req, res) => {
    const { prompt, brand } = req.body;

    if (!prompt || !brand) {
        return res.status(400).json({ error: 'Prompt and Brand are required' });
    }

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
