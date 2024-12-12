import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

const CustomEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Load the initial content if provided
  useEffect(() => {
    if (value) {
      const contentState = convertFromRaw(JSON.parse(value));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [value]);

  // Handle text style changes (bold, italic, etc.)
  const handleStyleChange = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Handle content changes
  const handleChange = (state) => {
    setEditorState(state);
    onChange(state);  // Pass the content back to the parent component
  };

  return (
    <div>
      <div>
        <button onClick={() => handleStyleChange('BOLD')}>Bold</button>
        <button onClick={() => handleStyleChange('ITALIC')}>Italic</button>
        <button onClick={() => handleStyleChange('UNDERLINE')}>Underline</button>
      </div>
      <Editor editorState={editorState} onChange={handleChange} />
    </div>
  );
};

export default CustomEditor;
