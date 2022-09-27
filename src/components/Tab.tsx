import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from '@/lib/ClassNames.lib';

export default function Tabs({ tabs } : { tabs: { name: string, href: string }[] }) {
  const { pathname } = useLocation();
  return (
    <div className="justify-center flex mb-4">
      <div className="p-3 text-sm shadow-2xl rounded-md shadow-white/10 border-[1px]
    bg-darkBG2 border-neutral-200 dark:border-neutral-900 items-center space-x-4"
      >
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.href}
              className={classNames(
                (tab.href === pathname) || (`${tab.href}/` === pathname)
                  ? ' dark:text-orange-300 hover:text-white'
                  : 'dark:text-neutral-600 dark:hover:text-neutral-100 text-neutral-600 hover:text-neutral-900',
                'px-6 font-sans font-light text-lg rounded-md duration-300',
              )}
              aria-current={tab.href ? 'page' : undefined}
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
