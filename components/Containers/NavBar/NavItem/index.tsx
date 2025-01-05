import { ArrowUpRightIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import type { FC, HTMLAttributeAnchorTarget, PropsWithChildren } from 'react';

import ActiveLink from '@/components/Common/ActiveLink';

import styles from './index.module.css';

type NavItemType = 'nav' | 'footer';

type NavItemProps = {
  href: string;
  type?: NavItemType;
  className?: string;
  target?: HTMLAttributeAnchorTarget | undefined;
};

const NavItem: FC<PropsWithChildren<NavItemProps>> = ({
  href = '',
  type = 'nav',
  children,
  className,
  target,
}) => (
  <ActiveLink
    href={href}
    className={classNames(
      styles[type],
      `inline-flex items-center gap-2 rounded px-3 py-2 hover:bg-neutral-100 hover:dark:bg-neutral-900`,
      className
    )}
    activeClassName={styles.active}
    allowSubPath={href.startsWith('/')}
    target={target}
  >
    <span className={'text-sm font-medium leading-5'}>{children}</span>

    {((type === 'nav' && href.startsWith('http')) || target === '_blank') && (
      <ArrowUpRightIcon
        className={`size-3 text-neutral-500 dark:text-neutral-200`}
      />
    )}
  </ActiveLink>
);

export default NavItem;
