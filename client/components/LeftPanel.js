import { FileText, Play, AlertCircle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function LeftPanel({
  templates,
  selectedType,
  prompt,
  context,
  isGenerating,
  error,
  onTypeChange,
  onPromptChange,
  onContextChange,
  onGenerate,
  onClearError,
}) {
  const selectedTemplate = templates.find(t => t.key === selectedType);

  return (
    <div className="left-panel">
      <div className="header">
        <h1>📋 Doc Generator</h1>
        <p>AI-powered product documentation</p>
      </div>

      <div className="panel-content">
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
            <span style={{ color: '#dc2626', fontSize: '0.875rem', flex: 1 }}>
              {error}
            </span>
            <button
              onClick={onClearError}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Document Type
          </label>
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            disabled={isGenerating}
          >
            {templates.map((template) => (
              <option key={template.key} value={template.key}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Prompt Template
            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
              (editable)
            </span>
          </label>
          <textarea
            className="form-textarea"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Enter your prompt template..."
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Context
            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
              (describe your project/feature)
            </span>
          </label>
          <textarea
            className="form-textarea"
            style={{ minHeight: '120px' }}
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Provide context about your project, feature, or requirements..."
            disabled={isGenerating}
          />
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            textAlign: 'right', 
            marginTop: '0.25rem' 
          }}>
            {context.length}/5000 characters
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={onGenerate}
          disabled={isGenerating || !context.trim()}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size={16} />
              Generating...
            </>
          ) : (
            <>
              <Play size={16} />
              Generate Document
            </>
          )}
        </button>

        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f8fafc', 
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          <strong>💡 Tips:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
            <li>Be specific in your context</li>
            <li>Include target audience details</li>
            <li>Mention key features or requirements</li>
            <li>Customize the prompt template as needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
