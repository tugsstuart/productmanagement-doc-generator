const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  console.log('Testing Google Gemini API...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ No Gemini API key found');
    console.log('💡 Get your free API key at: https://makersuite.google.com/app/apikey');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Test with updated model names
    console.log('🧪 Testing generation with gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Write a short test message to confirm the Gemini API is working. Keep it under 50 words.');
    
    const response = await result.response;
    console.log('✅ Gemini API test successful!');
    console.log('Response:', response.text());
    
    // Test other available models
    const modelsToTest = ['gemini-1.5-pro', 'gemini-1.0-pro'];
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`\n🧪 Testing ${modelName}...`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        const testResult = await testModel.generateContent('Hello!');
        const testResponse = await testResult.response;
        console.log(`✅ ${modelName} available!`);
        console.log('Response:', testResponse.text());
      } catch (error) {
        console.log(`⚠️ ${modelName} not available:`, error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Gemini API Error:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Your API key appears to be invalid');
    } else if (error.message.includes('quota')) {
      console.log('💡 Rate limit or quota exceeded');
    } else if (error.message.includes('not found')) {
      console.log('💡 Model not available - this is normal, we\'ll use available models');
    }
  }
}

testGemini();
