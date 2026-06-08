function validateOpenAIRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body must be a JSON object.' };
  }

  const prompt = String(body.prompt || '').trim();
  if (!prompt) {
    return { valid: false, message: 'Prompt text is required.' };
  }

  if (prompt.length > 2000) {
    return { valid: false, message: 'Prompt is too long. Please keep it under 2000 characters.' };
  }

  return { valid: true };
}

module.exports = { validateOpenAIRequest };
