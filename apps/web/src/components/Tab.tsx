import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '@devclad/lib';

export default function Tabs({ tabs }: { tabs: { name: string; href: string }[] }) {
  const { pathname } = useLocation();
  return (
    <div className="mb-4 flex justify-center">
      <div
        className="items-center space-x-4 rounded-md border-[1px] border-neutral-800 bg-darkBG2 p-3
    text-sm shadow-2xl shadow-white/20 duration-1000 hover:border-neutral-700 hover:bg-darkBG"
      >
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.href}
              className={classNames(
                tab.href === pathname || `${tab.href}/` === pathname
                  ? ' hover:text-white dark:text-orange-300'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-100',
                'rounded-md px-6 font-sans text-lg font-light duration-300'
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
