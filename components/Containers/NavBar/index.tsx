'use client';

import Hamburger from '@heroicons/react/24/solid/Bars3Icon';
import XMark from '@heroicons/react/24/solid/XMarkIcon';
import * as Label from '@radix-ui/react-label';
import type { FC } from 'react';
import { forwardRef, useState } from 'react';

import NavItem from '@/components/Containers/NavBar/NavItem';
import Link from '@/components/Link';
import WithNodejsLogo from '@/components/withNodejsLogo';

import { cn } from '@/components/Common/shadcn/cn';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/Common/shadcn/navigation-menu';
import type { MappedNavigationEntry } from '@/hooks/react-generic/useSiteNavigation';
import { navigationItems } from '@/hooks/react-generic/useSiteNavigation';

const navInteractionIcons = {
  show: <Hamburger className={'size-6'} />,
  close: <XMark className={'size-6'} />,
};

type NavbarProps = {
  onThemeTogglerClick?: () => void;
};

const NavBar: FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-950 lg:flex lg:h-16 lg:flex-row lg:items-center lg:gap-8 lg:border-b lg:px-8`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-neutral-200 px-4 dark:border-neutral-900 lg:flex lg:h-full lg:items-center lg:border-0 lg:px-0`}
      >
        <Link className={'flex-1'} href="/" aria-label="Home">
          <WithNodejsLogo />
        </Link>

        <Label.Root
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={`block cursor-pointer lg:hidden`}
          htmlFor="sidebarItemToggler"
        >
          {navInteractionIcons[isMenuOpen ? 'close' : 'show']}
        </Label.Root>
      </div>

      <input className="peer hidden" id="sidebarItemToggler" type="checkbox" />

      <div
        className={`hidden flex-1 flex-col peer-checked:flex  lg:flex  lg:flex-row lg:items-center`}
      >
        <div
          className={`flex flex-col gap-1 border-b border-neutral-200 p-4 dark:border-neutral-900 lg:flex-1 lg:flex-row lg:border-0 lg:p-0`}
        >
          {navigationItems.map(([key, item]) =>
            item.items?.length ? (
              <Navigation key={key} item={item} />
            ) : (
              <NavItem key={key} href={item.link} target={item.target}>
                {item.label}
              </NavItem>
            )
          )}
        </div>

        <div
          className={`flex items-center gap-2 border-b border-neutral-200 p-4 dark:border-neutral-900 lg:border-0 lg:p-0`}
        >
          {/* <SearchButton /> */}

          {/* <ThemeToggle onClick={onThemeTogglerClick} /> */}
          {/*


    <Link
   className={'size-9 rounded-md p-2 hover:bg-neutral-100 hover:dark:bg-neutral-900'}
   href="https://github.com/januarylabs/node"
   aria-label="Node.js Github"
    >
   <GitHub className="fill-neutral-700 dark:fill-neutral-300" />
    </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

const ListItem = forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

function Navigation(props: { item: MappedNavigationEntry }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{props.item.label}</NavigationMenuTrigger>
          <NavigationMenuContent>
            {props.item.items.map(([key, item]) => (
              <ListItem
                key={key}
                href={item.link}
                target={item.target}
                title={item.label as string}
              >
                {item.description}
              </ListItem>
            ))}

            {/* <NavigationMenuLink
      className={navigationMenuTriggerStyle()}
       >
      Link
       </NavigationMenuLink> */}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
