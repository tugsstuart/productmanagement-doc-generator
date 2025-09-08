const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LLMClient {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'openai';
    this.initializeClients();
  }

  initializeClients() {
    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Anthropic client
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    // Initialize Gemini client
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async generateContent(prompt, context) {
    const fullPrompt = prompt.replace('{{context}}', context);

    try {
      if (this.provider === 'gemini' && this.gemini) {
        return await this.generateWithGemini(fullPrompt);
      } else if (this.provider === 'anthropic' && this.anthropic) {
        return await this.generateWithAnthropic(fullPrompt);
      } else if (this.provider === 'openai' && this.openai) {
        return await this.generateWithOpenAI(fullPrompt);
      } else {
        // Mock response for development
        return this.generateMockResponse(fullPrompt);
      }
    } catch (error) {
      console.error('LLM Generation Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async generateWithOpenAI(prompt) {
    // Try models in order of preference - you have access to these great models!
    const models = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
    
    for (const model of models) {
      try {
        const response = await this.openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical writer and product manager. Generate well-structured, professional documentation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
        });

        console.log(`✅ Successfully used model: ${model}`);
        return response.choices[0].message.content;
      } catch (error) {
        console.log(`❌ Model ${model} failed:`, error.message);
        
        // If quota exceeded, don't try other models - they'll all fail
        if (error.status === 429) {
          console.log('💡 Quota exceeded - switching to mock mode');
          throw new Error('OpenAI quota exceeded. Please check your billing or try again later.');
        }
        
        if (model === models[models.length - 1]) {
          // If this is the last model, throw the error
          throw error;
        }
        // Otherwise, continue to next model
      }
    }
  }

  async generateWithAnthropic(prompt) {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    return response.content[0].text;
  }

  async generateWithGemini(prompt) {
    try {
      // Try models in order of preference (updated model names)
      const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
      
      for (const modelName of models) {
        try {
          const model = this.gemini.getGenerativeModel({ model: modelName });
          
          const result = await model.generateContent({
            contents: [{
              role: 'user',
              parts: [{
                text: `You are an expert technical writer and product manager. Generate well-structured, professional documentation.\n\n${prompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 3000,
            },
          });

          const response = await result.response;
          console.log(`✅ Successfully used Gemini model: ${modelName}`);
          return response.text();
        } catch (error) {
          console.log(`❌ Gemini model ${modelName} failed:`, error.message);
          
          // If quota exceeded, don't try other models
          if (error.message.includes('quota') || error.message.includes('429')) {
            console.log('💡 Gemini quota exceeded - switching to mock mode');
            throw new Error('Gemini quota exceeded. Please check your usage or try again later.');
          }
          
          if (modelName === models[models.length - 1]) {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  generateMockResponse(prompt) {
    // Extract document type from prompt if possible
    const docType = prompt.includes('PRD') ? 'PRD' : 
                   prompt.includes('FRD') ? 'FRD' :
                   prompt.includes('UAT') ? 'UAT' :
                   prompt.includes('User Stories') ? 'User Stories' :
                   prompt.includes('Acceptance Criteria') ? 'Acceptance Criteria' :
                   prompt.includes('Meeting Minutes') ? 'Meeting Minutes' : 'Document';

    return `# ${docType} - Sample Document

> **Note:** This is a mock response because:
> - Your ${this.provider === 'openai' ? 'OpenAI' : this.provider === 'anthropic' ? 'Anthropic' : 'Gemini'} quota has been exceeded, or
> - No API key is configured for ${this.provider}
> 
> To get real AI-generated content:
> 1. **OpenAI**: Check billing at https://platform.openai.com/usage
> 2. **Anthropic**: Check usage at https://console.anthropic.com/
> 3. **Gemini**: Check quota at https://makersuite.google.com/
> 4. Click the settings button (⚙️) in bottom-right to switch providers
> 5. Restart the application after adding credits

## Document Overview

This is a professionally structured ${docType.toLowerCase()} template that demonstrates the application's capabilities.

### Key Features
- **Professional formatting** with proper markdown structure
- **Comprehensive sections** covering all essential elements
- **Export functionality** to PDF, DOCX, and Markdown formats
- **Editable content** that you can modify before exporting

## Main Content Sections

### 1. Introduction
This section would contain the introduction and purpose of your ${docType.toLowerCase()}.

### 2. Requirements/Details
- **Requirement 1:** Detailed description of the first requirement
- **Requirement 2:** Detailed description of the second requirement
- **Requirement 3:** Detailed description of the third requirement

### 3. Implementation Details
\`\`\`
Code examples or technical specifications would go here
\`\`\`

### 4. Success Criteria
| Criteria | Description | Priority |
|----------|-------------|----------|
| Criterion 1 | Must meet basic functionality | High |
| Criterion 2 | Should enhance user experience | Medium |
| Criterion 3 | Could provide additional value | Low |

### 5. Next Steps
1. **Review** this generated content
2. **Edit** any sections as needed using the Edit button
3. **Export** to your preferred format (PDF, DOCX, or Markdown)
4. **Customize** the prompt template for better results

---

*Generated on ${new Date().toLocaleString()} using mock mode*

**💡 Pro tip:** Once your OpenAI quota is restored, you'll get much more detailed and context-specific content!`;
  }
}

module.exports = new LLMClient();
