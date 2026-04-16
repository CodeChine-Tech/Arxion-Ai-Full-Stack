import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// ✅ Models
router.get('/models', (req, res) => {
  res.json({
    data: [
      { id: 'arxon/main' },
      { id: 'arxon/agentic' },
      { id: 'arxon/reasoning' },
      { id: 'arxon/fast' },
    ],
  });
});

// ✅ Chat (PROTECTED)
router.post('/chat/completions', authMiddleware, async (req, res) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { model, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    const userMessage = messages[messages.length - 1]?.content || '';

    const reply = `Arxon (${model}) says: ${userMessage}`;

    // ✅ Update usage
    await supabase
      .from('api_keys')
      .update({ usage: (req.apiKey.usage || 0) + 1 })
      .eq('key', req.apiKey.key);

    // ✅ OpenAI format
    res.json({
      id: 'chatcmpl-001',
      object: 'chat.completion',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: reply,
          },
          finish_reason: 'stop',
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;