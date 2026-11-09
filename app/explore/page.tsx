import WithFooter from '@/components/withFooter';
import WithNavBar from '@/components/withNavBar';
import styles from '@/layouts/layouts.module.css';
import { dynamicRouter } from '@/next.dynamic.mjs';

import Button from '@/components/Common/Button';

import Link from 'next/link';
import Script from 'next/script';
import { Fragment } from 'react';
import { BiLogoPostgresql } from 'react-icons/bi';
import { HiCheckBadge } from 'react-icons/hi2';
import { SiGithub, SiHono } from 'react-icons/si';
import type { Project } from './utils';
import { getProject, getProjects } from './utils';

export const generateMetadata = () =>
  dynamicRouter.getPageMetadata('explore', 'Templates and starters');

export default async function Page() {
  const projects: Array<Project> = await Promise.all(
    (await getProjects()).map(async project => getProject(project.id))
  );

  return (
    <>
      <WithNavBar />

      <div className={styles.blogLayout}>
        <main>
          <header>
            <h1 className="w-full items-center justify-between text-center text-4xl">
              January template and starters projects
            </h1>
            <p className="mt-2 text-center text-lg font-medium text-neutral-800 dark:text-neutral-200">
              Jumpstart Your API Development with January's Templates and
              Starters
            </p>
          </header>
          <ul className="my-8 list-none px-4">
            {projects.map(({ id, config }) => (
              <Fragment key={config.projectName}>
                <li
                  className="grid items-center justify-between gap-x-4"
                  style={{
                    gridTemplateColumns: 'minmax(0, 1fr) max-content',
                  }}
                >
                  <div className="flex flex-col items-start">
                    <div className="mb-2 flex gap-x-2">
                      <BiLogoPostgresql size={28} className="text-[#2f6792]" />
                      <SiGithub size={24} />
                      <SiHono size={24} />
                    </div>
                    <h2>{config.title}</h2>
                    <p className="mt-1 text-sm  text-neutral-800 dark:text-neutral-600/80">
                      {config.description}
                    </p>

                    <Link
                      href={config.author.url}
                      className="mt-2 flex items-center justify-between"
                    >
                      <HiCheckBadge className="fill-blue-800" size={16} />
                      <span className="ml-1 text-sm">{config.author.name}</span>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <Button href={`/explore/${id}`}>Use project</Button>
                  </div>
                </li>
                <hr className="my-5"></hr>
              </Fragment>
            ))}
          </ul>
        </main>
      </div>

      <WithFooter />
      <Script
        id="mermaid"
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs";
        mermaid.initialize({startOnLoad: true});
        mermaid.contentLoaded();
`,
        }}
      />
    </>
  );
}

// Enforces that only the paths from `generateStaticParams` are allowed, giving 404 on the contrary
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = false;

// Enforces that this route is cached and static as much as possible
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'error';

// Ensures that this endpoint is invalidated and re-executed every X minutes
// so that when new deployments happen, the data is refreshed
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 21600; // 6 hours
