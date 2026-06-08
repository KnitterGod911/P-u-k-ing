const express = require('express');
const { OpenAI } = require('openai');
const { validateOpenAIRequest } = require('../utils/validate');

const router = express.Router();
const apiKey = process.env.OPENAI_API_KEY;

router.post('/', async (req, res) => {
  const validation = validateOpenAIRequest(req.body);

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured on the server.' });
  }

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: req.body.prompt,
      max_tokens: 400,
      temperature: 0.8
    });

    const text = Array.isArray(response.output) ? response.output.map(item => item.content?.map(chunk => chunk.text).join('') || '').join('') : '';
    res.json({ answer: text.trim() });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    res.status(500).json({ error: 'Unable to generate AI response at this time.' });
  }
});

module.exports = router;
