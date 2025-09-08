const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { marked } = require('marked');

class FileGenerators {
  static async generatePDF(content, filename) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];
        
        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve({
            buffer: pdfBuffer,
            filename: `${filename}.pdf`,
            contentType: 'application/pdf'
          });
        });

        // Add content to PDF
        doc.fontSize(20).text('Product Documentation', { align: 'center' });
        doc.moveDown();
        
        // Convert markdown to plain text for PDF
        const plainText = content.replace(/[#*`_]/g, '').replace(/\n\n/g, '\n');
        doc.fontSize(12).text(plainText, {
          align: 'left',
          lineGap: 5
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateDOCX(content, filename) {
    try {
      // Parse markdown content and convert to docx elements
      const lines = content.split('\n');
      const paragraphs = [];

      for (const line of lines) {
        if (line.trim() === '') {
          paragraphs.push(new Paragraph({}));
        } else if (line.startsWith('# ')) {
          paragraphs.push(new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
          }));
        } else if (line.startsWith('## ')) {
          paragraphs.push(new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
          }));
        } else if (line.startsWith('### ')) {
          paragraphs.push(new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
          }));
        } else if (line.startsWith('**') && line.endsWith('**')) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: line.substring(2, line.length - 2),
              bold: true,
            })],
          }));
        } else {
          paragraphs.push(new Paragraph({
            text: line,
          }));
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      
      return {
        buffer,
        filename: `${filename}.docx`,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    } catch (error) {
      throw new Error(`Failed to generate DOCX: ${error.message}`);
    }
  }

  static async generateMarkdown(content, filename) {
    try {
      const buffer = Buffer.from(content, 'utf8');
      
      return {
        buffer,
        filename: `${filename}.md`,
        contentType: 'text/markdown'
      };
    } catch (error) {
      throw new Error(`Failed to generate Markdown: ${error.message}`);
    }
  }
}

module.exports = FileGenerators;
