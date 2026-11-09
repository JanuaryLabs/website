'use client';
import type { ReactNode } from 'react';
import { useState } from 'react';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { PromptForm } from './PromptForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog';
import { Chat } from './docs-chat';
import { ChatList } from './docs-chatlist';
import { ScrollArea } from './scroll-area';
import { useMetaKey } from './use-metakey';

export type DocsCategory = {
  category: string;
};

export type Docs = {
  title: string;
  docs: ReactNode;
  icon: ReactNode;
};
export default function DocsCMDK(props: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(!!props.open);
  useMetaKey(
    'k',
    e => (e.metaKey || e.ctrlKey) && !e.shiftKey,
    () => setOpen(open => !open)
  );

  return (
    <Chat>
      <Dialog open={props.open || open} onOpenChange={setOpen}>
        <DialogContent>
          <VisuallyHidden.Root>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
          <div className="flex h-full flex-col justify-between">
            <ScrollArea className="chat-scroll h-full p-4 [&_>_[data-radix-scroll-area-viewport]_>_div]:h-full">
              <ChatList />
            </ScrollArea>
            <PromptForm />
          </div>
        </DialogContent>
      </Dialog>
    </Chat>
  );
}
