'use client';

import dedent from 'dedent';
import type { ReactNode } from 'react';
import { createContext, useCallback, useState } from 'react';
import { useList } from 'react-use';

import { AssistantMessage, UserMessage } from './docs-messages';

export type GenerationStatus =
  'pending' | 'generating' | 'generated' | 'error' | 'idle';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode;
};

export const ChatContext = createContext<{
  question: string;
  setQuestion: (question: string) => void;
  generationStatus: GenerationStatus;
  messages: Array<Message>;
  submitQuestion: () => void;
}>({
  generationStatus: 'idle',
  messages: [],
  question: '',
  setQuestion: () => {
    throw new Error(`ChatContext is not provided`);
  },
  submitQuestion: () => {
    throw new Error(`ChatContext is not provided`);
  },
});

export function Chat(props: { children: ReactNode }) {
  const [question, setQuestion] = useState<string>('');
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus>('idle');
  const [messages, actions] = useList<Message>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: dedent`Hi!\nI'm an AI assistant trained on documentation, code, and other content.\nAsk me anything about January.`,
    },
  ]);
  const [lastId, setLastId] = useState<string>(crypto.randomUUID());
  const [threadId, setThreadId] = useState<string | undefined>('');
  const submitQuestion = useCallback(async () => {
    try {
      if ((question || '').trim().length < 3) {
        return;
      }
      setLastId(crypto.randomUUID());
      setGenerationStatus('pending');
      actions.push({
        id: crypto.randomUUID(),
        role: 'user',
        content: <UserMessage message={question} />,
      });
      const response = await fetch('/chatWithDocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          threadId: threadId,
        }),
      });
      if ('error' in response) {
        actions.removeAt(messages.length - 1);
        setGenerationStatus('error');
        return Promise.reject((response as any).error);
      }
      setThreadId(response.headers.get('X-Thread-Id') as string);
      setGenerationStatus('generating');
      const body = response.body;
      if (!body) {
        setGenerationStatus('generated');
        return;
      }
      const TRUE = true;
      const reader = body.getReader();
      let total = '';

      while (TRUE) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(value);

        total += text;

        actions.upsert(x => x.id === lastId, {
          id: lastId,
          role: 'assistant',
          content: <AssistantMessage message={total} />,
        });
      }

      setQuestion('');
      setGenerationStatus('generated');
    } catch {
      setGenerationStatus('error');
    } finally {
      setGenerationStatus('idle');
    }
  }, []);
  return (
    <ChatContext.Provider
      value={{
        question,
        setQuestion,
        generationStatus,
        messages,
        submitQuestion: submitQuestion,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}
