'use client';

import { useContext } from 'react';
import { BsSend } from 'react-icons/bs';
import { VscLoading } from 'react-icons/vsc';

import Button from '@/components/Common/Button';
import { ChatContext } from './docs-chat';

export function PromptForm() {
  const { question, setQuestion, generationStatus, submitQuestion } =
    useContext(ChatContext);
  return (
    <div className="sticky bottom-0 mt-4 flex items-center bg-accent px-4 py-2 pr-2 pl-2.5">
      <form
        className="flex w-full items-center justify-center space-x-1"
        onSubmit={e => {
          e.preventDefault();
          submitQuestion();
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitQuestion();
          }
        }}
      >
        <input
          className="text-smtext-[#030712] flex w-full border-0 bg-transparent placeholder-[#6b7280] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="You can ask me if you need help with the documentation..."
          name="message"
          value={question}
          autoComplete="off"
          disabled={
            generationStatus === 'pending' || generationStatus === 'generating'
          }
          onChange={e => setQuestion(e.target.value)}
        />

        {generationStatus === 'generated' || generationStatus === 'idle' ? (
          <Button
            disabled={(question || '').length < 3}
            kind="primary"
            type="submit"
            className="relative transform cursor-pointer rounded-xl border border-[#422800] px-2 text-center font-medium shadow-[#422800_2px_2px_0_0] transition-transform duration-75 hover:translate-y-px active:translate-x-0.5 active:translate-y-0.5"
          >
            <BsSend size={18} />
          </Button>
        ) : (
          <Button
            kind="neutral"
            type="button"
            disabled={true}
            className="transform cursor-pointer rounded-2xl border border-[#422800] shadow-[#422800_2px_2px_0_0] transition-transform select-none active:translate-x-0.5 active:translate-y-0.5"
          >
            <VscLoading className="animate-spin" />
          </Button>
        )}
      </form>
    </div>
  );
}
