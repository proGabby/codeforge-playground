import React, { useState } from 'react';
import { Terminal, CheckCircle, XCircle, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TestRunnerPanel: React.FC = () => {
  const { executionResult, submissionResult, isExecuting } = useApp();
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');

  return (
    <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col select-none overflow-hidden">
      {/* Panel Header */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'output'
                ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              Test Suite{' '}
              {submissionResult && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {submissionResult.passedTestCount}/{submissionResult.totalTestCount}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Execution Metadata Status */}
        {executionResult && (
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{executionResult.executionTimeMs}ms</span>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  executionResult.exitCode === 0 ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              ></span>
              <span>Exit: {executionResult.exitCode}</span>
            </div>
          </div>
        )}
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs custom-scrollbar bg-slate-950">
        {isExecuting ? (
          <div className="flex items-center space-x-2 text-indigo-400 animate-pulse">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Executing Go code in isolated sandbox...</span>
          </div>
        ) : activeTab === 'output' ? (
          <div>
            {executionResult ? (
              <div className="space-y-1">
                {executionResult.stdout && (
                  <pre className="text-emerald-300 whitespace-pre-wrap">
                    {executionResult.stdout}
                  </pre>
                )}
                {executionResult.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap">
                    {executionResult.stderr}
                  </pre>
                )}
              </div>
            ) : (
              <span className="text-slate-600">Click 'Run' or 'Submit' to execute code...</span>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {submissionResult && submissionResult.testDetails ? (
              submissionResult.testDetails.map((t, idx) => (
                <div
                  key={t.testId || idx}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    t.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {t.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>Test {idx + 1}: {t.description || 'Behavioral Assertion'}</span>
                  </div>
                  <span className="text-[10px] font-mono">
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-slate-600">No test results available yet. Submit your code to test.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
