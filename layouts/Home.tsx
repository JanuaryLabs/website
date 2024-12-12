/* eslint-disable import/no-unresolved */

import { type FC, type PropsWithChildren } from 'react';

import GlowingBackdrop from '@/components/Common/GlowingBackdrop';
import { Mdx } from '@/components/mdx';
import MDXCodeTabs from '@/components/MDX/CodeTabs';
import CenteredLayout from '@/layouts/Centered';

import authenticatedUser from '!!raw-loader!../components/Examples/authenticated-user.md';
import githubTrigger from '!!raw-loader!../components/Examples/github-trigger.md';
import httpTrigger from '!!raw-loader!../components/Examples/http-trigger.md';
import sseTrigger from '!!raw-loader!../components/Examples/sse-trigger.md';
import webosocketTrigger from '!!raw-loader!../components/Examples/websocket-trigger.md';
import limitToCountry from '!!raw-loader!../components/Examples/limit-to-country.md';
import scheduleTrigger from '!!raw-loader!../components/Examples/schedule-trigger.md';
import queueTrigger from '!!raw-loader!../components/Examples/queue-trigger.md';
import sendEmail from '!!raw-loader!../components/Examples/send-email.md';
import uploadFile from '!!raw-loader!../components/Examples/upload-file.md';

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
              hideCopyButton={true}
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
              hideCopyButton={true}
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
              hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
            hideCopyButton={true}
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
        <section
          style={
            {
              '--ec-frm-frameBoxShdCssVal': '0 0 0 0',
              '--ec-brdCol': 'hsl(var(--border))',
              '--ec-brdRad': '0.0rem',
              '--ec-frm-edBg': 'rgb(13 18 28)', //bg-natural-900
            } as React.CSSProperties
          }
        >
          <MDXCodeTabs examples={examplesTabs} />
        </section>
      </main>
    </CenteredLayout>
  );
};

export default HomeLayout;
