import React, { useRef, useEffect, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Play, Send, Sparkles, FileCode, Plus, X, FileCheck, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CodeEditor: React.FC = () => {
  const {
    theme,
    code,
    setCode,
    files,
    activeFileName,
    setActiveFileName,
    addFile,
    deleteFile,
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
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileError, setFileError] = useState('');

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

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    let name = newFileName.trim().toLowerCase();
    if (!name) {
      setFileError('File name cannot be empty.');
      return;
    }
    if (!name.endsWith('.go')) {
      name += '.go';
    }
    if (files[name]) {
      setFileError(`File "${name}" already exists.`);
      return;
    }
    if (!/^[a-z0-9_]+(\.go)$/.test(name)) {
      setFileError('Use standard Go naming (lowercase letters, numbers, and underscores).');
      return;
    }

    setFileError('');
    const defaultTemplate = name.endsWith('_test.go')
      ? 'package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\t// Test implementation\n}\n'
      : 'package main\n\n// Package declarations and functions\n';

    addFile(name, defaultTemplate);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const fileList = Object.keys(files || { 'main.go': code });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Editor Top Bar with Multi-File Tabs */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 select-none">
        {/* File Tabs Carousel */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 max-w-[60%]">
          {fileList.map((fileName) => {
            const isActive = fileName === activeFileName;
            const isTestFile = fileName.endsWith('_test.go');
            return (
              <div
                key={fileName}
                onClick={() => setActiveFileName(fileName)}
                className={`group flex items-center space-x-1.5 px-3 py-1 rounded-t-md text-xs font-mono transition-all cursor-pointer border-t border-x ${
                  isActive
                    ? 'bg-slate-950 text-indigo-300 border-slate-700 font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800/80'
                }`}
              >
                {isTestFile ? (
                  <FileCheck className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                ) : (
                  <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                )}
                <span>{fileName}</span>

                {/* Close Button on non-main.go files */}
                {fileName !== 'main.go' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(fileName);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 ml-1 text-slate-500 hover:text-rose-400 rounded transition-opacity"
                    title={`Delete ${fileName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add File Button */}
          <button
            onClick={() => {
              setFileError('');
              setShowNewFileModal(true);
            }}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Create new Go file"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Add File</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {fileList.length > 1 && (
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded font-mono">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{fileList.length} files</span>
            </div>
          )}

          {/* Explain Line Button */}
          <button
            onClick={() => explainSelectedLine(selectedLineNumber || 1)}
            className="flex items-center space-x-1 px-2.5 py-1 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer"
            title="Highlight/select a line and click to get detailed syntax explanation"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Explain Line</span>
            <span>{selectedLineNumber ? `#${selectedLineNumber}` : ''}</span>
          </button>

          {/* Run Button */}
          <button
            onClick={runCode}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            title="Compile and run code"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Run</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={submitCode}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
            title="Submit solution for automated test evaluation"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* New File Creation Modal Dialog */}
      {showNewFileModal && (
        <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">Create New Go File</h3>
              </div>
              <button
                onClick={() => setShowNewFileModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  File Name (e.g. <span className="font-mono text-indigo-300">task.go</span> or <span className="font-mono text-indigo-300">models.go</span>)
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="task.go"
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {fileError && <p className="text-rose-400 text-[11px] mt-1">{fileError}</p>}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
