import { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import ProviderSelector from './ProviderSelector';
import { apiClient } from '../utils/api';

export default function Layout() {
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templateList = await apiClient.getTemplates();
      setTemplates(templateList);
      if (templateList.length > 0) {
        setSelectedType(templateList[0].key);
        loadTemplate(templateList[0].key);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      setError('Failed to load templates');
    }
  };

  const loadTemplate = async (type) => {
    try {
      const template = await apiClient.getTemplate(type);
      setPrompt(template.prompt);
      setError('');
    } catch (error) {
      console.error('Failed to load template:', error);
      setError('Failed to load template');
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    loadTemplate(type);
    setGeneratedContent(''); // Clear previous content
  };

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError('Please provide context for the document');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await apiClient.generateDocument({
        type: selectedType,
        prompt,
        context,
      });

      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.response?.data?.message || 'Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format, contentToExport = generatedContent) => {
    if (!contentToExport) {
      setError('No content to export');
      return;
    }

    try {
      const selectedTemplate = templates.find(t => t.key === selectedType);
      const filename = `${selectedTemplate?.name || selectedType}_${new Date().toISOString().split('T')[0]}`;

      const response = await apiClient.exportDocument({
        content: contentToExport,
        format,
        filename,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export document');
    }
  };

  const handleProviderChange = async (provider) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`🔄 Switched to ${provider}`);
        // Optionally show a success message
      } else {
        setError(`Failed to switch to ${provider}`);
      }
    } catch (error) {
      console.error('Provider switch failed:', error);
      setError('Failed to switch provider');
    }
  };

  return (
    <div className="app-container">
      <LeftPanel
        templates={templates}
        selectedType={selectedType}
        prompt={prompt}
        context={context}
        isGenerating={isGenerating}
        error={error}
        onTypeChange={handleTypeChange}
        onPromptChange={setPrompt}
        onContextChange={setContext}
        onGenerate={handleGenerate}
        onClearError={() => setError('')}
      />
      <RightPanel
        content={generatedContent}
        isGenerating={isGenerating}
        onExport={handleExport}
      />
      <ProviderSelector onProviderChange={handleProviderChange} />
    </div>
  );
}
