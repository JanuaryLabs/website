import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { Icons } from './Icons';
import { splitWords } from './split-words';

export default function QuickActions(props: {
  onExplain: (input: string) => void;
}) {
  const [highlightEnabled, enableHighlighting] = useState(false);
  const [highlightedText, highlightText] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  useDebounce(
    () => {
      //   if (highlightEnabled && highlightedText) {
      if (highlightedText) {
        buttonRef.current?.click();
        setMenuOpen(true);
      }
    },
    300,
    [highlightEnabled, highlightedText]
  );

  useEffect(() => {
    const handler = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString();
      const words = splitWords(selectedText ?? '');
      if (selection && selectedText && words.length > 1 && words.length <= 10) {
        let parentEl = selection.anchorNode?.parentElement;
        if (parentEl && parentEl.classList.contains('text-green-500')) {
          parentEl = parentEl.parentElement;
        }
        if (parentEl) {
          highlightText(selectedText);
          console.log({ parentEl, selectedText });
          const rect = parentEl.getBoundingClientRect();
          setXY({ x: rect.left, y: rect.top });
        }
        // TODO: auto select the rest of the word from left and right
        // TODO: Don't count stop words like , . ? ! etc
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  return (
    <Menu as="div" className="inline-block text-left">
      {() => (
        <>
          <Menu.Button className={'hidden'} ref={buttonRef}></Menu.Button>
          <button
            aria-label="Highlight Text"
            className="not-prose flex rounded-full border p-1.5"
            onClick={() => {
              enableHighlighting(!highlightEnabled);
            }}
          >
            <Icons.HighlightIcon enabled={highlightEnabled} />
          </button>
          <div
            style={{
              position: 'fixed',
              top: xy.y,
              left: xy.x,
            }}
            className="transition-[top,left]"
          >
            <Transition
              show={menuOpen}
              as={Fragment}
              enter="transition will-change-transform"
              enterFrom="transform opacity-0 scale-95 bg-transparent"
              enterTo="transform opacity-100 scale-100 bg-(--chat-bg)"
              leave="transition will-change-transform duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="divide-gray-100 ring-black/5 w-40 origin-top-right divide-y rounded-md shadow-lg ring-1 focus:outline-hidden">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          props.onExplain(highlightedText);
                        }}
                        className={`${
                          active ? 'bg-green-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <ExplainIcon />
                        Explain
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-green-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <DuplicateActiveIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : (
                          <DuplicateInactiveIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-green-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <ArchiveActiveIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArchiveInactiveIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                        Archive
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-green-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <DeleteActiveIcon
                            className="mr-2 h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <DeleteInactiveIcon
                            className="mr-2 h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                        )}
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </div>
        </>
      )}
    </Menu>
  );
}

function ExplainIcon() {
  return (
    <svg
      className="text-gray-800 mr-2 h-3.5 w-3.5 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 18"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: Record<string, any>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}
