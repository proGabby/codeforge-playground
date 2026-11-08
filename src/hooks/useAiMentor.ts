import { useState, useCallback } from 'react';
import type { ChatMessage, Exercise, ExecutionResult, LineExplanation } from '../types';

export function useAiMentor(
  activeExercise: Exercise | null,
  code: string,
  executionResult: ExecutionResult | null
) {
  const [lineExplanation, setLineExplanation] = useState<LineExplanation | null>(null);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | null>(null);
  const [hasAttemptedCurrentExercise, setHasAttemptedCurrentExercise] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const explainSelectedLine = useCallback(
    async (lineNum?: number) => {
      const targetLine = lineNum ?? selectedLineNumber;
      if (!targetLine || !code) return;
      try {
        const res = await fetch('/api/explain-line', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, lineNumber: targetLine, languageId: 'go' }),
        });
        const data = await res.json();
        setLineExplanation(data);
      } catch (err) {
        console.error('Error fetching line explanation:', err);
      }
    },
    [code, selectedLineNumber]
  );

  const askAiMentor = useCallback(
    async (question: string) => {
      if (!question.trim()) return;
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setIsAskingAi(true);

      try {
        const res = await fetch('/api/ai-mentor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseTitle: activeExercise?.title || 'Go Exercise',
            instructions: activeExercise?.instructions || '',
            concept: activeExercise?.concept || 'Go Syntax',
            userCode: code,
            stdout: executionResult?.stdout || '',
            stderr: executionResult?.stderr || '',
            question,
            chatHistory: chatMessages,
          }),
        });
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text:
            data.answer ||
            "I'm here to help you work through this code step-by-step. What do you think happens on line 1?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text:
            "I couldn't reach the mentor service at the moment. Try checking your syntax and running the test again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsAskingAi(false);
      }
    },
    [activeExercise, code, executionResult, chatMessages]
  );

  const resetExerciseAiState = useCallback(() => {
    setLineExplanation(null);
    setSelectedLineNumber(null);
    setHasAttemptedCurrentExercise(false);
    setChatMessages([]);
  }, []);

  return {
    lineExplanation,
    setLineExplanation,
    selectedLineNumber,
    setSelectedLineNumber,
    explainSelectedLine,
    hasAttemptedCurrentExercise,
    setHasAttemptedCurrentExercise,
    chatMessages,
    setChatMessages,
    isAskingAi,
    askAiMentor,
    resetExerciseAiState,
  };
}
