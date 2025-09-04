import React, { useRef, useState, useEffect } from "react";
import { Bold, Type, Edit3, Save, FileText } from "react-feather";

export default function TextEditor() {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const toggleBold = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    console.log('Bold toggle - selected text:', selectedText);
    
    if (selectedText) {
      // Check if the selected text is already bold
      let isCurrentlyBold = false;
      
      // Check if the range is already inside a bold element
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;
      
      // Check both start and end containers for bold formatting
      const checkElement = (container) => {
        if (container.nodeType === Node.TEXT_NODE) {
          const parent = container.parentElement;
          return parent && (
            parent.style.fontWeight === 'bold' || 
            parent.style.fontWeight === '700' ||
            parent.style.fontWeight === '900' ||
            parent.closest('span[style*="font-weight"]') !== null
          );
        } else {
          return container.style.fontWeight === 'bold' || 
                 container.style.fontWeight === '700' ||
                 container.style.fontWeight === '900' ||
                 container.closest('span[style*="font-weight"]') !== null;
        }
      };
      
      isCurrentlyBold = checkElement(startContainer) || checkElement(endContainer);
      
      console.log('Bold toggle - isCurrentlyBold:', isCurrentlyBold, 'startContainer:', startContainer, 'endContainer:', endContainer);
      
      if (isCurrentlyBold) {
        // Remove bold by finding and unwrapping bold elements
        const boldElements = editorRef.current.querySelectorAll('span[style*="font-weight"]');
        boldElements.forEach(boldElement => {
          const parent = boldElement.parentNode;
          while (boldElement.firstChild) {
            parent.insertBefore(boldElement.firstChild, boldElement);
          }
          parent.removeChild(boldElement);
        });
        setIsBold(false);
      } else {
        // Add bold by wrapping in a span with EXTREME styling
        const spanElement = document.createElement('span');
        spanElement.style.fontWeight = '900';
        spanElement.style.color = '#000000';
        spanElement.style.textShadow = '1px 1px 0px #000000';
        spanElement.style.letterSpacing = '0.5px';
        spanElement.style.fontSize = '1.1em';
        spanElement.style.backgroundColor = '#f0f0f0';
        spanElement.style.padding = '1px 2px';
        spanElement.style.borderRadius = '2px';
        try {
          range.surroundContents(spanElement);
          console.log('Bold applied successfully');
        } catch (e) {
          console.log('surroundContents failed, using fallback:', e);
          // If surroundContents fails, extract content and replace
          const contents = range.extractContents();
          spanElement.appendChild(contents);
          range.insertNode(spanElement);
        }
        setIsBold(true);
      }
    } else {
      // If no text is selected, just toggle the bold state for future typing
      setIsBold(!isBold);
    }
    
    editorRef.current.focus();
  };

  const toggleHighlight = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Check if the selected text is already highlighted
      const container = range.commonAncestorContainer;
      const parentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      const isCurrentlyHighlighted = parentElement.style.backgroundColor === 'yellow' || 
                                   parentElement.style.backgroundColor === 'rgb(255, 255, 0)' ||
                                   parentElement.style.backgroundColor === '#ffff00';
      
      if (isCurrentlyHighlighted) {
        // Remove highlighting by unwrapping the span
        const spanElement = parentElement.closest('span[style*="background-color"]');
        if (spanElement) {
          const parent = spanElement.parentNode;
          while (spanElement.firstChild) {
            parent.insertBefore(spanElement.firstChild, spanElement);
          }
          parent.removeChild(spanElement);
        }
        setIsHighlighted(false);
      } else {
        // Add highlighting by wrapping in a span
        const spanElement = document.createElement('span');
        spanElement.style.backgroundColor = '#ffff00';
        try {
          range.surroundContents(spanElement);
        } catch (e) {
          // If surroundContents fails, extract content and replace
          const contents = range.extractContents();
          spanElement.appendChild(contents);
          range.insertNode(spanElement);
        }
        setIsHighlighted(true);
      }
    } else {
      // If no text is selected, just toggle the highlight state for future typing
      setIsHighlighted(!isHighlighted);
    }
    
    editorRef.current.focus();
  };

  const changeFontSize = (size) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // If text is selected, wrap it in a span with font size
      const spanElement = document.createElement('span');
      spanElement.style.fontSize = `${size}px`;
      try {
        range.surroundContents(spanElement);
      } catch (e) {
        // If surroundContents fails, extract content and replace
        const contents = range.extractContents();
        spanElement.appendChild(contents);
        range.insertNode(spanElement);
      }
    } else {
      // If no text is selected, apply font size to the entire editor
      editorRef.current.style.fontSize = `${size}px`;
    }
    
    setFontSize(size);
    editorRef.current.focus();
  };

  const saveContent = () => {
    const content = editorRef.current.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-notes.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      editorRef.current.innerHTML = '';
    }
  };

  // Update formatting states when selection changes
  useEffect(() => {
    const updateFormattingState = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const parentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        
        // Check if current selection is bold
        const isCurrentlyBold = parentElement.style.fontWeight === 'bold' || 
                              parentElement.style.fontWeight === '700' ||
                              parentElement.style.fontWeight === '900' ||
                              parentElement.closest('span[style*="font-weight"]') !== null ||
                              editorRef.current.querySelector('span[style*="font-weight"]') !== null;
        setIsBold(isCurrentlyBold);
        
        // Check if current selection is highlighted
        const isCurrentlyHighlighted = parentElement.style.backgroundColor === 'yellow' || 
                                     parentElement.style.backgroundColor === 'rgb(255, 255, 0)' ||
                                     parentElement.style.backgroundColor === '#ffff00';
        setIsHighlighted(isCurrentlyHighlighted);
      }
    };

    document.addEventListener('selectionchange', updateFormattingState);
    return () => document.removeEventListener('selectionchange', updateFormattingState);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <style>{`
        .text-editor span[style*="background-color: rgb(255, 255, 0)"], 
        .text-editor span[style*="background-color: #ffff00"] { 
          background-color: #ffff00 !important; 
        }
        .text-editor span[style*="font-weight"] {
          font-weight: 900 !important;
          color: #000000 !important;
          text-shadow: 1px 1px 0px #000000 !important;
          letter-spacing: 0.5px !important;
          font-size: 1.1em !important;
          background-color: #f0f0f0 !important;
          padding: 1px 2px !important;
          border-radius: 2px !important;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <FileText className="text-gray-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Interview Notes</h2>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isBold ? 'bg-blue-200 text-blue-800' : ''
          }`}
          title={isBold ? "Bold formatting active - select text to apply" : "Bold - select text first, then click"}
        >
          <Bold size={16} />
        </button>
        
        <div className="flex items-center gap-2">
          <Type size={16} className="text-gray-600" />
          <select
            value={fontSize}
            onChange={(e) => changeFontSize(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
          </select>
        </div>

        <button
          onClick={toggleHighlight}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isHighlighted ? 'bg-yellow-200 text-yellow-800' : ''
          }`}
          title={isHighlighted ? "Highlight formatting active - select text to apply" : "Highlight - select text first, then click"}
        >
          <Edit3 size={16} />
        </button>

        <div className="flex-1" />

        <button
          onClick={clearContent}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
        >
          Clear
        </button>
        
        <button
          onClick={saveContent}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Save size={14} />
          Save
        </button>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Select text first, then click Bold or Highlight to format it. 
          {isBold && " Bold formatting is active."}
          {isHighlighted && " Highlight formatting is active."}
        </p>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <div
          ref={editorRef}
          contentEditable
          className="text-editor w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto"
          style={{
            minHeight: '400px',
            fontSize: `${fontSize}px`,
            lineHeight: '1.6'
          }}
          placeholder="Start typing your interview notes here..."
          onInput={() => {
            // Update button states based on current selection
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const container = range.commonAncestorContainer;
              const parentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
              
              // Check if current selection is bold
              const isCurrentlyBold = parentElement.style.fontWeight === 'bold' || 
                                    parentElement.style.fontWeight === '700' ||
                                    parentElement.style.fontWeight === '900' ||
                                    parentElement.closest('span[style*="font-weight"]') !== null ||
                                    editorRef.current.querySelector('span[style*="font-weight"]') !== null;
              setIsBold(isCurrentlyBold);
              
              // Check if current selection is highlighted
              const isCurrentlyHighlighted = parentElement.style.backgroundColor === 'yellow' || 
                                           parentElement.style.backgroundColor === 'rgb(255, 255, 0)' ||
                                           parentElement.style.backgroundColor === '#ffff00';
              setIsHighlighted(isCurrentlyHighlighted);
            }
          }}
        />
      </div>
    </div>
  );
}
