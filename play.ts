import { dockerfile, nextjs, withinNetwork } from 'serverize/dockerfile';

const postgresql = dockerfile({
  start: {
    from: 'postgres:alpine',
    port: 5432,
    environment: {
      POSTGRES_USER: 'dev_user',
      POSTGRES_DB: 'dev_db',
      POSTGRES_PASSWORD: 'dev_password',
    },
  },
});

const file = nextjs({
  packageManager: 'npm',
  output: 'export',
  distDir: 'build',
});

await withinNetwork(async network => {
  await file.run({
    networks: [network],
  });
  await postgresql.run({
    networks: [network],
  });
  console.log('');
});
