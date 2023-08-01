import React, { useRef, useState } from "react";

const TestTextEditor = () => {
  const editorRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText("");
    }
  };

  const handleBold = () => {
    formatSelectedText("bold");
  };

  const handleItalic = () => {
    formatSelectedText("italic");
  };

  const handleUnderline = () => {
    formatSelectedText("underline");
  };

  const formatSelectedText = (style) => {
    if (selectedText.length > 0) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const styledText = document.createElement(style);

      styledText.textContent = selectedText;
      range.deleteContents();
      range.insertNode(styledText);

      // Clear the selection after formatting
      selection.removeAllRanges();
    }
  };

  return (
    <div className="text-editor">
      <div className="toolbar">
        <button onClick={handleBold}>Bold</button>
        <button onClick={handleItalic}>Italic</button>
        <button onClick={handleUnderline}>Underline</button>
      </div>
      <div
        className="editor-content"
        ref={editorRef}
        contentEditable
        onMouseUp={handleSelectionChange}
      >
        This is an editable text. Select some text here to apply formatting.
      </div>
    </div>
  );
};

export default TestTextEditor;
