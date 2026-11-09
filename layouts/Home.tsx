import { type FC, type PropsWithChildren } from 'react';

import GlowingBackdrop from '@/components/Common/GlowingBackdrop';
import { Mdx } from '@/components/mdx';
import MDXCodeTabs from '@/components/MDX/CodeTabs';
import CenteredLayout from '@/layouts/Centered';

import authenticatedUser from '@/components/Examples/authenticated-user.md';
import githubTrigger from '@/components/Examples/github-trigger.md';
import httpTrigger from '@/components/Examples/http-trigger.md';
import sseTrigger from '@/components/Examples/sse-trigger.md';
import webosocketTrigger from '@/components/Examples/websocket-trigger.md';
import limitToCountry from '@/components/Examples/limit-to-country.md';
import scheduleTrigger from '@/components/Examples/schedule-trigger.md';
import queueTrigger from '@/components/Examples/queue-trigger.md';
import sendEmail from '@/components/Examples/send-email.md';
import uploadFile from '@/components/Examples/upload-file.md';

import { TryProject } from '@/components/Common/CodeBox/try-project';
import styles from './layouts.module.css';
const examplesTabs = [
  {
    id: 'api-endpoints',
    title: 'Triggers',
    children: [
      {
        id: 'http',
        title: 'HTTP',
        content: (
          <>
            <Mdx
              source={httpTrigger}
              components={{
                h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
                Footer: TryProject,
              }}
            />
          </>
        ),
      },
      {
        id: 'sse',
        title: 'SSE',
        content: (
          <>
            <Mdx
              source={sseTrigger}
              components={{
                h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
                Footer: TryProject,
              }}
            />
          </>
        ),
      },
      {
        id: 'websocket',
        title: 'Websocket',
        content: (
          <>
            <Mdx
              source={webosocketTrigger}
              components={{
                h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
                Footer: TryProject,
              }}
            />
          </>
        ),
      },
      {
        id: 'jobTrigger',
        title: 'Process Job',
        content: (
          <Mdx
            source={queueTrigger}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
      {
        id: 'scheduleTrigger',
        title: 'Schedule Trigger',
        content: (
          <Mdx
            source={scheduleTrigger}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
      {
        id: 'githubTrigger',
        title: 'Github Trigger',
        content: (
          <Mdx
            source={githubTrigger}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication',
    children: [
      {
        id: 'authenticateUser',
        title: 'Authenticate User',
        content: (
          <Mdx
            source={authenticatedUser}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
      {
        id: 'country',
        title: 'Limit to Country',
        content: (
          <Mdx
            source={limitToCountry}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
    ],
  },
  {
    id: 'upload-files',
    title: 'Upload Files',
    children: [
      // TODO: add example of uploading files to s3 and rename this one to upload to google cloud storage
      //  TODO: add example of restricting file size and type
      // TODO: add example of uploading large files
      // TODO: add example of resumable uploads
      {
        id: 'uploadFile',
        title: 'Upload File',
        content: (
          <Mdx
            source={uploadFile}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
    ],
  },
  {
    id: 'send-emails',
    title: 'Send Emails',
    children: [
      // TODO: add example of sending emails mailgun, sendgrid, ses
      {
        id: 'sendEmail',
        title: 'Send Email',
        content: (
          <Mdx
            source={sendEmail}
            components={{
              h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
              Footer: TryProject,
            }}
          />
        ),
      },
    ],
  },
  // {
  //   id: 'database',
  //   title: 'Database',
  //   children: [],
  // },
];

const HomeLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <CenteredLayout>
      <GlowingBackdrop />

      <main className={styles.homeLayout}>
        {children}
        <section>
          <MDXCodeTabs examples={examplesTabs} />
        </section>
      </main>
    </CenteredLayout>
  );
};

export default HomeLayout;
