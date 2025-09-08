const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/generate', require('./routes/generate'));
app.use('/api/export', require('./routes/export'));

// Provider switching endpoint
app.post('/api/provider', (req, res) => {
  const { provider } = req.body;
  
  if (!['openai', 'anthropic', 'gemini'].includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider. Must be: openai, anthropic, or gemini' });
  }
  
  // Update environment variable
  process.env.LLM_PROVIDER = provider;
  
  // Reinitialize the LLM client
  const llmClient = require('./utils/llmClient');
  llmClient.provider = provider;
  llmClient.initializeClients();
  
  console.log(`🔄 Switched to provider: ${provider}`);
  
  res.json({ 
    success: true, 
    provider, 
    message: `Successfully switched to ${provider}` 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API status check
app.get('/api/status', async (req, res) => {
  const llmClient = require('./utils/llmClient');
  
  const status = {
    timestamp: new Date().toISOString(),
    provider: process.env.LLM_PROVIDER || 'openai',
    openai_key_present: !!process.env.OPENAI_API_KEY,
    anthropic_key_present: !!process.env.ANTHROPIC_API_KEY,
    gemini_key_present: !!process.env.GEMINI_API_KEY,
  };
  
  // Test basic API connectivity
  try {
    if (process.env.OPENAI_API_KEY && llmClient.openai) {
      // Try to list models to verify API key
      const models = await llmClient.openai.models.list();
      status.openai_status = 'connected';
      status.available_models = models.data.filter(m => m.id.includes('gpt')).map(m => m.id).slice(0, 5);
    }
  } catch (error) {
    status.openai_status = 'error';
    status.openai_error = error.message;
  }
  
  // Test Gemini connectivity
  try {
    if (process.env.GEMINI_API_KEY && llmClient.gemini) {
      // Try to get a simple response to verify API key
      const model = llmClient.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('Test');
      status.gemini_status = 'connected';
    }
  } catch (error) {
    status.gemini_status = 'error';
    status.gemini_error = error.message;
  }
  
  res.json(status);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  console.log(`🤖 LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
});
