import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Vercel headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Rate limiting for /api/*
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests' }
});
app.use('/api/v1', apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Arxon AI Backend Active 🚀', 
    timestamp: new Date().toISOString(),
    endpoints: ['/api/v1/models', '/api/v1/chat/completions', '/api/v1/generate-key', '/api/v1/contact']
  });
});

// API Routes
app.get('/api/v1/models', (req, res) => {
  res.json({
    data: [
      { id: 'arxon/main', name: 'Arxon Main' },
      { id: 'arxon/agentic', name: 'Arxon Agentic' },
      { id: 'arxon/reasoning', name: 'Arxon Reasoning' },
      { id: 'arxon/fast', name: 'Arxon Fast' }
    ]
  });
});

app.post('/api/v1/chat/completions', async (req, res) => {
  try {
    const { model = 'arxon/main', messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    const reply = `Arxon ${model.replace('arxon/', '')} → "${userMessage}"`;
    
    // Mock Supabase update (Vercel env vars)
    // In production: integrate real Supabase
    
    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      model,
      choices: [{
        index: 0,
        message: { role: 'assistant', content: reply },
        finish_reason: 'stop'
      }],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat completion failed' });
  }
});

app.post('/api/v1/generate-key', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid name & email required' });
    }

    const key = `sk-${crypto.randomUUID().replace(/-/g, '').slice(0, 32)}`;
    
    // Mock Supabase insert
    console.log(`New key generated: ${key} for ${email}`);
    
    res.json({ 
      key, 
      message: 'API key created (demo - store locally)',
      expiry: '30 days',
      usage_limit: 10000
    });
  } catch (err) {
    res.status(500).json({ error: 'Key generation failed' });
  }
});

app.post('/api/v1/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Mock email (nodemailer needs env vars)
    console.log(`Contact form: ${name} (${email}): ${message}`);
    
    res.json({ success: true, message: 'Message received! (demo mode)' });
  } catch (err) {
    res.status(500).json({ error: 'Contact failed' });
  }
});

export default app;
