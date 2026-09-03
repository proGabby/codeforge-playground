import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Play, Send, Sparkles, FileCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CodeEditor: React.FC = () => {
  const {
    theme,
    code,
    setCode,
    runCode,
    submitCode,
    isExecuting,
    submissionResult,
    explainSelectedLine,
    setSelectedLineNumber,
    selectedLineNumber,
  } = useApp();

  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Track line selection for "Explain This Line"
    editor.onDidChangeCursorPosition((e) => {
      setSelectedLineNumber(e.position.lineNumber);
    });
  };

  // Update inline error line markers on Monaco Editor
  useEffect(() => {
    if (!editorRef.current) return;

    if (submissionResult?.correction?.lineIndex) {
      const errLine = submissionResult.correction.lineIndex;
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: errLine,
            startColumn: 1,
            endLineNumber: errLine,
            endColumn: 100,
          },
          options: {
            isWholeLine: true,
            className: 'bg-rose-500/20 border-l-4 border-rose-500',
            glyphMarginClassName: 'myGlyphMarginClass',
            hoverMessage: { value: submissionResult.correction.whatHappened },
          },
        },
      ]);
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [submissionResult]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Editor Top Bar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 select-none">
        {/* Active File Tab */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-t-md text-xs font-mono text-indigo-300">
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>main.go</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Explain This Line Button */}
          <button
            onClick={() => explainSelectedLine(selectedLineNumber || 1)}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer"
            title="Highlight/select a line and click to get detailed syntax explanation"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Explain Line {selectedLineNumber ? `#${selectedLineNumber}` : ''}</span>
          </button>

          {/* Run Button */}
          <button
            onClick={runCode}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Run</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={submitCode}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="go"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: false,
            lineNumbersMinChars: 3,
            bracketPairColorization: { enabled: true },
            cursorBlinking: 'smooth',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
