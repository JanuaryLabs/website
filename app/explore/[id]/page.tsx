import { getProject, getProjects } from '@/app/explore/utils';
import Button from '@/components/Common/Button';
import { Mdx } from '@/components/mdx';
import WithFooter from '@/components/withFooter';
import WithNavBar from '@/components/withNavBar';
import { Fragment } from 'react';
import { SiGithub, SiSwagger } from 'react-icons/si';

export async function generateStaticParams() {
  return getProjects();
}

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const project = await getProject(params.id);
  const info = {
    framework: 'Hono',
    database: 'PostgreSQL',
    cloud: 'Fly.io',
  };
  return (
    <>
      <WithNavBar />

      <main className="grid h-full grid-cols-1 !gap-0 px-8 md:grid-cols-9 md:px-6 lg:px-16">
        <header className="top-0 flex md:sticky md:col-start-1 md:col-end-5">
          <div className="mt-12">
            <h1 className="w-full items-center justify-between  text-5xl">
              {project.config.title}
            </h1>
            <p className="mt-8 text-neutral-800 dark:text-neutral-600/80">
              {project.config.description}
            </p>
            <div className="mt-4 flex flex-col items-start gap-3.5">
              <Button
                kind="special"
                className="flex items-center gap-x-2 !px-2 !py-1 text-sm"
                href={
                  process.env.NODE_ENV === 'development'
                    ? `http://localhost:1234?project=${project.id}`
                    : `https://${project.id}.beta.january.sh`
                }
              >
                <SiSwagger size={16} className="!size-4" />
                API Docs
              </Button>
              <Button
                kind="primary"
                href={project.url}
                className="flex items-center gap-x-2 !px-2 !py-1 text-sm"
              >
                <SiGithub size={16} className="!size-4" />
                Source code
              </Button>
              <a href={`https://idx.google.com/import?url=${project.url}`}>
                <picture>
                  <source
                    media="(prefers-color-scheme: light)"
                    srcSet="https://cdn.idx.dev/btn/open_dark_32.svg"
                  />
                  <source
                    media="(prefers-color-scheme: dark)"
                    srcSet="https://cdn.idx.dev/btn/open_light_32.svg"
                  />
                  <img
                    height="32"
                    alt="Open in IDX"
                    src="https://cdn.idx.dev/btn/open_purple_32.svg"
                  />
                </picture>
              </a>
              <a href={`https://codespaces.new/${project.repo}?quickstart=1`}>
                <img
                  src="https://github.com/codespaces/badge.svg"
                  alt="Open in GitHub Codespaces"
                  style={{
                    maxWidth: '100%',
                  }}
                />
              </a>
            </div>

            <ul className="my-4 px-0">
              {Object.entries(info).map(([key, value]) => (
                <Fragment key={key}>
                  <li className="flex items-center justify-between ">
                    <p className="text-sm font-semibold capitalize text-neutral-800 dark:text-neutral-600/80">
                      {key}
                    </p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-600/80">
                      {value}
                    </p>
                  </li>
                  <hr className="my-2"></hr>
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="separator mx-8 hidden h-full md:block lg:mx-12"></div>
        </header>
        <article className="mb-12 mt-12 flex flex-col gap-4 md:col-span-5">
          <Mdx source={project.readme} />
        </article>
      </main>

      <WithFooter />
    </>
  );
}
