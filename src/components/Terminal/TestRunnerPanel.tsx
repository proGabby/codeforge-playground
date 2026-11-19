import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TestRunnerPanel: React.FC = () => {
  const { executionResult, submissionResult, isExecuting } = useApp();
  const [activeTab, setActiveTab] = useState<'tests' | 'output'>('tests');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if we are in failure state (compiler error or test assertion failure)
  const isCompilerError = executionResult && !executionResult.compiledSuccessfully;
  const isTestFailure =
    Boolean(submissionResult && !submissionResult.success) ||
    Boolean(submissionResult?.testDetails?.some((t) => !t.passed));

  const hasFailed = isCompilerError || isTestFailure;

  // Derive execution time display
  const durationSec = executionResult?.executionTimeMs
    ? (executionResult.executionTimeMs / 1000).toFixed(3) + 's'
    : '0.004s';

  // Extract stdout
  const stdoutContent = executionResult?.stdout ? executionResult.stdout.trim() : '12';

  // Extract compiler blocker message if any
  const blockerNote = isCompilerError
    ? (() => {
        const stderr = executionResult?.stderr || '';
        const match = stderr.match(/(?:main\.go|solution\.go):(\d+)(?::\d+)?:?\s*(.*)/i);
        if (match) {
          return `Current run blocked at main.go:${match[1]}. Fix the type error to rerun.`;
        }
        return 'Current run blocked at main.go:10. Fix the type error to rerun.';
      })()
    : 'Current run blocked at main.go:10. Fix the type error to rerun.';

  // Default mock test cases matching Figma mockups
  const testChips = submissionResult?.testDetails?.length
    ? submissionResult.testDetails.map((t) => ({
        name: t.description || t.testId || 'assertion',
        passed: t.passed,
        expected: t.expected,
        actual: t.actual,
      }))
    : [
        { name: 'positive_values', passed: true, expected: '12', actual: '12' },
        { name: 'empty_slice', passed: true, expected: '0', actual: '0' },
        { name: 'negative_values', passed: !hasFailed, expected: '-6', actual: hasFailed ? '0' : '-6' },
      ];

  const failedTest = testChips.find((t) => !t.passed) || testChips[2];
  const passedCount = testChips.filter((t) => t.passed).length;
  const totalCount = testChips.length;

  return (
    <div
      className={`bg-[#0B0E14] border-t border-[#121620] flex flex-col select-none overflow-hidden transition-all duration-200 ${
        isCollapsed ? 'h-9' : 'h-64'
      }`}
    >
      {/* 1. Header with Tabs & Collapse Button */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-[#121620] shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('tests')}
            className={`text-xs font-semibold pb-0.5 transition-all cursor-pointer ${
              activeTab === 'tests'
                ? 'text-[#F2F4F8] border-b-2 border-[#3B82F6]'
                : 'text-[#737F94] hover:text-[#99A3B5]'
            }`}
          >
            Test results
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`text-xs font-semibold pb-0.5 transition-all cursor-pointer ${
              activeTab === 'output'
                ? 'text-[#F2F4F8] border-b-2 border-[#3B82F6]'
                : 'text-[#737F94] hover:text-[#99A3B5]'
            }`}
          >
            Output
          </button>
        </div>

        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-[#737F94] hover:text-[#F2F4F8] p-1 cursor-pointer transition-colors"
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Content Area */}
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-sans text-xs">
          {isExecuting ? (
            <div className="flex items-center space-x-2 text-[#3B82F6] font-mono animate-pulse py-4">
              <span>Compiling and executing in sandbox...</span>
            </div>
          ) : activeTab === 'output' ? (
            /* Output Tab View */
            <div className="font-mono space-y-2">
              {executionResult ? (
                <>
                  {executionResult.stdout && (
                    <pre className="text-[#F2F4F8] whitespace-pre-wrap leading-relaxed">
                      {executionResult.stdout}
                    </pre>
                  )}
                  {executionResult.stderr && (
                    <pre className="text-red-400 whitespace-pre-wrap leading-relaxed">
                      {executionResult.stderr}
                    </pre>
                  )}
                </>
              ) : (
                <div className="text-[#737F94]">Click Run or Submit to see execution output.</div>
              )}
            </div>
          ) : hasFailed ? (
            /* Test Results: ERROR & FAILURE STATE (matches Figma Mockup 7) */
            <div className="space-y-3">
              {/* Status Row */}
              <div className="flex items-center">
                <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-[6px]">
                  {totalCount - passedCount} of {totalCount} tests failed
                </span>
                <span className="text-xs text-[#737F94] ml-3">Last completed run</span>
                <span className="text-xs font-mono text-[#737F94] ml-auto">{durationSec}</span>
              </div>

              {/* Horizontal Test Chips Row */}
              <div className="flex items-center space-x-2 pt-1 overflow-x-auto scrollbar-none">
                {testChips.map((chip, idx) => {
                  const isPassed = chip.passed;
                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono flex items-center space-x-1.5 shrink-0 ${
                        isPassed
                          ? 'bg-[#121620] text-[#737F94]'
                          : 'bg-[#2A1519] text-red-400 border border-red-500/40 font-medium'
                      }`}
                    >
                      <span>{isPassed ? '✓' : '×'}</span>
                      <span>{chip.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Side-by-side Assertion Diff Card */}
              <div className="bg-[#121620] rounded-[10px] p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 block uppercase">
                    EXPECTED
                  </span>
                  <div className="text-xl font-mono font-bold text-[#F2F4F8] mt-1">
                    {failedTest.expected}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#737F94] block uppercase">
                    ACTUAL
                  </span>
                  <div className="text-xl font-mono font-bold text-[#F2F4F8] mt-1">
                    {failedTest.actual}
                  </div>
                </div>
              </div>

              {/* Current run blocker footnote */}
              <div className="text-xs text-[#737F94] pt-0.5">{blockerNote}</div>
            </div>
          ) : (
            /* Test Results: HAPPY STATE (matches Figma Mockup 2 & 6) */
            <div className="space-y-3">
              {/* Status Row */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-sm font-bold text-[#F2F4F8] flex items-center gap-1.5">
                  <span className="text-[#3B82F6]">✓</span>
                  <span>{passedCount} tests passed</span>
                </span>
                <span className="text-[#737F94] ml-2">0 failed</span>
                <span className="text-[#737F94] font-mono ml-2">{durationSec}</span>
              </div>

              {/* Horizontal Test Chips Row */}
              <div className="flex items-center space-x-2 pt-1 overflow-x-auto scrollbar-none">
                {testChips.map((chip, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-[6px] bg-[#121620] text-[#99A3B5] text-xs font-mono flex items-center space-x-1.5 shrink-0"
                  >
                    <span className="text-[#3B82F6]">✓</span>
                    <span>{chip.name}</span>
                  </div>
                ))}
              </div>

              {/* Stdout Card */}
              <div className="bg-[#121620] rounded-[10px] p-3 max-w-sm">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[#737F94] uppercase block">
                  stdout
                </span>
                <div className="text-sm font-mono font-bold text-[#F2F4F8] mt-1">
                  {stdoutContent}
                </div>
              </div>

              {/* PASS verification line */}
              <div className="text-xs font-mono text-[#737F94] pt-1">
                PASS codeforge.dev/slices {durationSec}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
