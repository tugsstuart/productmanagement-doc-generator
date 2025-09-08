const express = require('express');
const path = require('path');
const fs = require('fs');
const llmClient = require('../utils/llmClient');

const router = express.Router();

// Load templates
const templatesPath = path.join(__dirname, '../data/templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

// GET /api/generate/templates - Get all available templates
router.get('/templates', (req, res) => {
  try {
    const templateList = Object.keys(templates).map(key => ({
      key,
      name: templates[key].name,
    }));
    res.json(templateList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

// GET /api/generate/template/:type - Get specific template
router.get('/template/:type', (req, res) => {
  try {
    const { type } = req.params;
    const template = templates[type];
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load template' });
  }
});

// POST /api/generate - Generate document content
router.post('/', async (req, res) => {
  try {
    const { type, prompt, context } = req.body;

    // Validation
    if (!type || !prompt || !context) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, prompt, and context are required' 
      });
    }

    if (context.length > 5000) {
      return res.status(400).json({ 
        error: 'Context is too long. Please limit to 5000 characters.' 
      });
    }

    console.log(`🤖 Generating ${type} document...`);
    
    // Generate content using LLM
    const generatedContent = await llmClient.generateContent(prompt, context);
    
    console.log(`✅ Document generated successfully`);
    
    res.json({
      success: true,
      content: generatedContent,
      type,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate document',
      message: error.message 
    });
  }
});

module.exports = router;
