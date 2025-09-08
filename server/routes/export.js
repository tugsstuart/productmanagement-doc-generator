const express = require('express');
const FileGenerators = require('../utils/fileGenerators');

const router = express.Router();

// POST /api/export - Export document in specified format
router.post('/', async (req, res) => {
  try {
    const { content, format, filename = 'document' } = req.body;

    if (!content || !format) {
      return res.status(400).json({ 
        error: 'Missing required fields: content and format are required' 
      });
    }

    if (!['pdf', 'docx', 'markdown'].includes(format.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid format. Supported formats: pdf, docx, markdown' 
      });
    }

    console.log(`📄 Exporting document as ${format.toUpperCase()}...`);

    let result;
    
    switch (format.toLowerCase()) {
      case 'pdf':
        result = await FileGenerators.generatePDF(content, filename);
        break;
      case 'docx':
        result = await FileGenerators.generateDOCX(content, filename);
        break;
      case 'markdown':
        result = await FileGenerators.generateMarkdown(content, filename);
        break;
    }

    // Set response headers for file download
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);

    console.log(`✅ Document exported as ${result.filename}`);
    
    res.send(result.buffer);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Failed to export document',
      message: error.message 
    });
  }
});

module.exports = router;
