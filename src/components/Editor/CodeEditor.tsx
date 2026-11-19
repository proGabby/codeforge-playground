import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Check, X, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CodeEditor: React.FC = () => {
  const {
    code,
    setCode,
    files,
    setFiles,
    activeFileName,
    setActiveFileName,
    addFile,
    deleteFile,
    executionResult,
    submissionResult,
    activeExercise,
    activeTopic,
    selectedLanguage,
    setSelectedLineNumber,
  } = useApp();

  const isPy = activeExercise?.languageId === 'python' || selectedLanguage === 'python' || activeFileName.endsWith('.py');
  const defaultEntry = isPy ? 'main.py' : 'main.go';
  const testFileName = isPy ? 'test_solution.py' : 'solution_test.go';

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const zoneIdRef = useRef<string | null>(null);

  const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileError, setFileError] = useState('');

  // Generate synthetic test file content if not already in files
  useEffect(() => {
    if (!files[testFileName]) {
      const isGo = !isPy;
      let generatedTest = '';
      if (isGo) {
        generatedTest = `package main

import "testing"

func TestPositiveValues(t *testing.T) {
\tresult := Sum([]int{2, 4, 6})
\tif result != 12 {
\t\tt.Errorf("expected 12, got %d", result)
\t}
}

func TestEmptySlice(t *testing.T) {
\tresult := Sum([]int{})
\tif result != 0 {
\t\tt.Errorf("expected 0, got %d", result)
\t}
}

func TestNegativeValues(t *testing.T) {
\tresult := Sum([]int{-1, -2, -3})
\tif result != -6 {
\t\tt.Errorf("expected -6, got %d", result)
\t}
}
`;
      } else {
        generatedTest = `import pytest
from main import sum_slice

def test_positive_values():
    assert sum_slice([2, 4, 6]) == 12

def test_empty_slice():
    assert sum_slice([]) == 0

def test_negative_values():
    assert sum_slice([-1, -2, -3]) == -6
`;
      }

      setFiles({
        ...(files || {}),
        [defaultEntry]: code || files[defaultEntry] || '',
        [testFileName]: generatedTest,
      }, activeFileName || defaultEntry);
    }
  }, [testFileName, isPy, defaultEntry]);

  // Extract compiler diagnostic details
  const compilerDiagnostic = useMemo(() => {
    // 1. From submissionResult.correction
    if (submissionResult?.correction?.lineIndex) {
      return {
        line: submissionResult.correction.lineIndex,
        message:
          submissionResult.correction.rawCompilerError ||
          submissionResult.correction.whatHappened ||
          'type mismatch or syntax error',
      };
    }

    // 2. From executionResult if compilation failed
    if (executionResult && !executionResult.compiledSuccessfully && executionResult.stderr) {
      const stderr = executionResult.stderr;
      // Match Go line: e.g. main.go:10:23: cannot use total as string
      const goMatch = stderr.match(/(?:main\.go|solution\.go):(\d+)(?::\d+)?:?\s*(.*)/i);
      if (goMatch) {
        return {
          line: parseInt(goMatch[1], 10),
          message: goMatch[2]?.trim() || 'compiler error',
        };
      }

      // Match Python line: File "main.py", line 10, in ... \n TypeError: ...
      const pyLineMatch = stderr.match(/line (\d+)/i);
      const pyErrMatch = stderr.match(/([A-Za-z]+Error:\s*.*)/);
      if (pyLineMatch) {
        return {
          line: parseInt(pyLineMatch[1], 10),
          message: pyErrMatch ? pyErrMatch[1].trim() : 'runtime error',
        };
      }

      return {
        line: 1,
        message: stderr.split('\n')[0] || 'compilation error',
      };
    }

    return null;
  }, [submissionResult, executionResult]);

  // Monaco Mount Handler
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define CodeForge dark theme matching Figma #0B0E14
    monaco.editor.defineTheme('codeforge-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '737F94', fontStyle: 'italic' },
        { token: 'keyword', foreground: '3B82F6', fontStyle: 'bold' },
        { token: 'string', foreground: '10B981' },
        { token: 'number', foreground: 'F59E0B' },
        { token: 'type', foreground: '60A5FA' },
        { token: 'function', foreground: '93C5FD' },
        { token: 'variable', foreground: 'F2F4F8' },
      ],
      colors: {
        'editor.background': '#0E131F',
        'editor.foreground': '#F2F4F8',
        'editorLineNumber.foreground': '#64748B',
        'editorLineNumber.activeForeground': '#F2F4F8',
        'editor.lineHighlightBackground': '#151C2C',
        'editorCursor.foreground': '#3B82F6',
        'editorIndentGuide.background': '#1A2234',
        'editorIndentGuide.activeBackground': '#25324C',
      },
    });

    monaco.editor.setTheme('codeforge-dark');

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ lineNumber: e.position.lineNumber, column: e.position.column });
      setSelectedLineNumber(e.position.lineNumber);
    });
  };

  // Update inline error line markers & ViewZone banner
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // 1. Line highlight decorations
    if (compilerDiagnostic && compilerDiagnostic.line) {
      const errLine = compilerDiagnostic.line;
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(errLine, 1, errLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-red-500/15',
            lineNumberClassName: 'text-red-400 font-bold',
            hoverMessage: { value: `compiler error: ${compilerDiagnostic.message}` },
          },
        },
      ]);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }

    // 2. ViewZone for inline error banner directly underneath the offending line
    editor.changeViewZones((changeAccessor: any) => {
      if (zoneIdRef.current) {
        changeAccessor.removeZone(zoneIdRef.current);
        zoneIdRef.current = null;
      }

      if (compilerDiagnostic && compilerDiagnostic.line) {
        const domNode = document.createElement('div');
        domNode.className = 'w-full py-1 px-4 my-0.5 text-xs font-mono select-none flex items-center gap-2 text-red-400 bg-red-950/30 border-l-2 border-red-500 rounded-r';
        domNode.innerHTML = `<span class="font-bold text-sm leading-none">&times;</span><span>compiler error: ${escapeHtml(
          compilerDiagnostic.message
        )}</span>`;

        zoneIdRef.current = changeAccessor.addZone({
          afterLineNumber: compilerDiagnostic.line,
          heightInLines: 1.5,
          domNode,
        });
      }
    });
  }, [compilerDiagnostic]);

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    let name = newFileName.trim().toLowerCase();
    if (!name) {
      setFileError('File name cannot be empty.');
      return;
    }
    const ext = isPy ? '.py' : '.go';
    if (!name.endsWith(ext)) {
      name += ext;
    }
    if (files[name]) {
      setFileError(`File "${name}" already exists.`);
      return;
    }

    addFile(name, isPy ? '# Python module\n' : 'package main\n\n');
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const fileList = Object.keys(files || { [defaultEntry]: code });
  const topicOrder = activeTopic?.order ? String(activeTopic.order).padStart(2, '0') : '02';
  const exIndex = activeExercise?.difficulty ? String(activeExercise.difficulty).padStart(2, '0') : '04';
  const exerciseLabel = `${topicOrder}.${exIndex}`;
  const exerciseTitle = activeExercise?.title || 'Sum a slice';

  return (
      <div className="flex-1 flex flex-col h-full bg-[#0E131F] overflow-hidden relative">
        {/* 1. Top File Tabs Bar */}
          <div className="h-10 bg-[#0B101B] border-b border-[#182133] flex items-center justify-between px-3 select-none shrink-0">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
              {fileList.map((fileName) => {
                const isActive = fileName === activeFileName;
                const isMain = fileName === 'main.go' || fileName === 'main.py';

                return (
                  <button
                    key={fileName}
                    onClick={() => setActiveFileName(fileName)}
                    className={`group flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-xs font-mono transition-all cursor-pointer ${isActive
                          ? 'bg-[#0E131F] text-[#F2F4F8] font-medium'
                          : 'text-[#737F94] hover:text-[#99A3B5] hover:bg-[#121927]'
                      }`}
                  >
                    <span>{fileName}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                    ) : !isMain ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(fileName);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[#737F94] hover:text-red-400 transition-opacity"
                      >
                        ×
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setFileError('');
                  setShowNewFileModal(true);
                }}
                className="p-1 rounded text-[#737F94] hover:text-[#F2F4F8] hover:bg-[#121927] transition-colors cursor-pointer"
                title="Create new file"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Exercise Subheader */}
            <div className="h-9 px-4 bg-[#0E131F] flex items-center justify-between border-b border-[#182133] select-none shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[#3B82F6]">{exerciseLabel}</span>
                <span className="text-xs font-bold text-[#F2F4F8]">{exerciseTitle}</span>
              </div>
              <div className="text-[11px] font-mono text-[#737F94]">
                {isPy ? 'Python 3.12 · UTF-8' : 'Go 1.22 · UTF-8'}
              </div>
            </div>

            {/* 3. New File Creation Modal */}
            {showNewFileModal && (
              <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-xs bg-[#121620] rounded-[10px] p-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-[#F2F4F8]">
                      New {isPy ? 'Python' : 'Go'} File
                    </h3>
                    <button
                      onClick={() => setShowNewFileModal(false)}
                      className="text-[#737F94] hover:text-[#F2F4F8]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateFile} className="space-y-3">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder={isPy ? 'helper.py' : 'helper.go'}
                      autoFocus
                      className="w-full bg-[#0B0E14] border-0 rounded-[8px] px-3 py-2 text-xs font-mono text-[#F2F4F8] placeholder-[#737F94] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    {fileError && <p className="text-red-400 text-[11px]">{fileError}</p>}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowNewFileModal(false)}
                        className="px-3 py-1.5 text-xs text-[#737F94] hover:text-[#F2F4F8]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[8px] text-xs font-semibold"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 4. Monaco Editor Canvas */}
            <div className="flex-1 relative min-h-0">
              <Editor
                height="100%"
                language={isPy ? 'python' : 'go'}
                defaultLanguage={isPy ? 'python' : 'go'}
                theme="codeforge-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Geist', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: isPy,
                  lineNumbersMinChars: 3,
                  bracketPairColorization: { enabled: true },
                  cursorBlinking: 'smooth',
                  padding: { top: 12, bottom: 12 },
                  lineDecorationsWidth: 6,
                }}
              />
            </div>

            {/* 5. Editor Status Bar */}
              <div className="h-6 bg-[#0B101B] border-t border-[#182133] px-4 flex items-center justify-between text-[11px] select-none shrink-0">
                <div className="flex items-center space-x-2">
                  {compilerDiagnostic ? (
                    <span className="text-red-400 font-medium flex items-center gap-1">
                      <span>×</span>
                      <span>1 compiler error</span>
                    </span>
                  ) : (
                    <span className="text-[#737F94] flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#737F94]" />
                      <span>All changes saved</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-[#737F94] font-mono">
                  <span>
                    Ln {cursorPos.lineNumber}, Col {cursorPos.column}
                  </span>
                  <span>Spaces: 4</span>
                </div>
              </div>
            </div>
            );
};

            function escapeHtml(text: string): string {
  return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
}
