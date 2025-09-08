const { OpenAI } = require('openai');
require('dotenv').config();

async function testOpenAI() {
  console.log('Testing OpenAI API...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    return;
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  try {
    console.log('🔍 Fetching available models...');
    const models = await openai.models.list();
    
    const gptModels = models.data
      .filter(model => model.id.includes('gpt'))
      .map(model => model.id)
      .sort();
    
    console.log('✅ Available GPT models:');
    gptModels.forEach(model => console.log(`  - ${model}`));
    
    // Test with the simplest model
    console.log('\\n🧪 Testing generation with gpt-3.5-turbo...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Write a short test message to confirm the API is working.'
        }
      ],
      max_tokens: 50,
    });
    
    console.log('✅ Test successful!');
    console.log('Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.status === 401) {
      console.log('💡 This usually means your API key is invalid or expired');
    } else if (error.status === 429) {
      console.log('💡 Rate limit exceeded or insufficient quota');
    }
  }
}

testOpenAI();
