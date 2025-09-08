import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, Eye, Edit } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function RightPanel({ content, isGenerating, onExport }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'edit'
  const [editableContent, setEditableContent] = useState('');

  // Update editable content when content changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleExport = (format) => {
    const contentToExport = viewMode === 'edit' ? editableContent : content;
    onExport(format, contentToExport);
  };

  const toggleViewMode = () => {
    if (viewMode === 'preview') {
      setEditableContent(content);
      setViewMode('edit');
    } else {
      setViewMode('preview');
    }
  };

  return (
    <div className="right-panel">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>📄 Document Preview</h1>
            <p>Generated content and export options</p>
          </div>
          {content && (
            <button
              className="btn btn-secondary"
              onClick={toggleViewMode}
              style={{ marginLeft: '1rem' }}
            >
              {viewMode === 'preview' ? (
                <>
                  <Edit size={16} />
                  Edit
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Preview
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {content && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div className="export-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => handleExport('pdf')}
            >
              <Download size={14} />
              PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport('docx')}
            >
              <Download size={14} />
              DOCX
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport('markdown')}
            >
              <Download size={14} />
              Markdown
            </button>
          </div>
        </div>
      )}

      <div className="preview-container">
        {isGenerating ? (
          <div className="preview-empty">
            <LoadingSpinner size={40} />
            <h3 style={{ marginTop: '1rem' }}>Generating document...</h3>
            <p>This may take a few moments</p>
          </div>
        ) : content ? (
          <div className="preview-content">
            {viewMode === 'preview' ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                style={{
                  width: '100%',
                  height: 'calc(100vh - 200px)', /* Take full available height */
                  minHeight: '400px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  padding: '0',
                  background: 'transparent'
                }}
              />
            )}
          </div>
        ) : (
          <div className="preview-empty">
            <FileText size={64} />
            <h3>No document generated yet</h3>
            <p>Select a document type, enter context, and click "Generate Document" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
