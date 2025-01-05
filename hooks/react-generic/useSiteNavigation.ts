import type { HTMLAttributeAnchorTarget } from 'react';

import { siteNavigation } from '@/next.json.mjs';
import type { NavigationEntry, NavigationKeys } from '@/types';
import type { FormattedMessage } from '@/types/i18n';

type Navigation = Record<string, NavigationEntry>;

export interface MappedNavigationEntry {
  items: Array<[string, MappedNavigationEntry]>;
  label: FormattedMessage;
  link: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  description?: string;
}

const mapNavigationEntries = (entries: Navigation) => {
  return Object.entries(entries).map(
    ([key, { label, link, items, target, description }]): [
      string,
      MappedNavigationEntry,
    ] => [
      key,
      {
        target,
        label: label ? label : '',
        link: link ?? '',
        items: items ? mapNavigationEntries(items) : [],
        description,
      },
    ]
  );
};

const getSideNavigation = (keys: Array<NavigationKeys>) => {
  const navigationEntries: Navigation = keys.reduce(
    (acc, key) => ({ ...acc, [key]: siteNavigation.sideNavigation[key] }),
    {}
  );
  return mapNavigationEntries(navigationEntries);
};
export const navigationItems = mapNavigationEntries(
  siteNavigation.topNavigation
);

const useSiteNavigation = () => {
  return { getSideNavigation, navigationItems };
};

export default useSiteNavigation;
