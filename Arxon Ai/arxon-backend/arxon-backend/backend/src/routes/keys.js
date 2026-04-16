import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

router.post('/generate-key', async (req, res) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { name, email } = req.body;

    // ✅ Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const key = 'sk-' + crypto.randomBytes(16).toString('hex');

    const { error } = await supabase.from('api_keys').insert([
      {
        name,
        email,
        key,
        usage: 0,
      },
    ]);

    if (error) throw error;

    res.json({ key, expiry: '7 days' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Key generation failed' });
  }
});

export default router;