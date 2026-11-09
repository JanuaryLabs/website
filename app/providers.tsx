'use client';

import { posthog } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import PostHogPageView from './PostHogPageView';
import { Suspense } from 'react';

if (typeof window !== 'undefined') {
  posthog.init('phc_PORJdMHMucNgcwabzQbEsaCrvfe23rQH8iDMAFaLwlS', {
    api_host: `/ingest`,
    ui_host: 'https://us.posthog.com',
    autocapture: process.env.NODE_ENV === 'production',
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: process.env.NODE_ENV === 'production', // Enable automatic pageleave capture
    capture_performance: process.env.NODE_ENV === 'production', // Enable performance monitoring
    loaded: function (ph) {
      if (process.env['NODE_ENV'] === 'development') {
        ph.opt_out_capturing(); // opts a user out of event capture
        ph.set_config({ disable_session_recording: true });
      }
    },
  });
}

export const PHProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PostHogProvider client={posthog}>
      <Suspense>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
};
