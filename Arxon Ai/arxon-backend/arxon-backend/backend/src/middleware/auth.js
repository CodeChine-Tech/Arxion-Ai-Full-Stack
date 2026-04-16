import { createClient } from '@supabase/supabase-js';

const authMiddleware = async (req, res, next) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Missing API key' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', token)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    req.apiKey = data;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Auth error' });
  }
};

export default authMiddleware;