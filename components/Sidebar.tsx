'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/generators', label: 'Generators' },
    { href: '/generators/books', label: 'Books' },
    { href: '/generators/shops', label: 'Shops' },
    { href: '/generators/encounters', label: 'Encounters' },
    { href: '/generators/landmass', label: 'Landmass' },
    { href: '/generators/loot', label: 'Loot' },
    { href: '/generators/names', label: 'Names' },
    { href: '/generators/poi', label: 'POI' },
    { href: '/generators/quests', label: 'Quests' },
    { href: '/generators/settlements', label: 'Settlements' },
  ];

  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {links.map(link => {
        const active = pathname === link.href || pathname?.startsWith(link.href + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => onClick?.()}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              active ? 'bg-moss-700 text-white' : 'text-moss-200 hover:bg-moss-800/50 hover:text-moss-100'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-md bg-moss-800/80 border border-moss-700/30 flex items-center justify-center text-moss-100"
        >
          ☰
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-moss-900/80 border-r border-moss-700/30 z-20 backdrop-blur-md p-4 hidden md:block">
        <div className="mb-6">
          <h2 className="font-serif text-2xl text-moss-50">Mossy Tomes</h2>
          <p className="text-sm text-moss-300">TTRPG Tools</p>
        </div>

        <NavList />

        {/* removed redundant Back to Home link - Home is already in the main nav */}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative w-72 h-full bg-moss-900/95 border-r border-moss-700/30 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-2xl text-moss-50">Mossy Tomes</h2>
                <p className="text-sm text-moss-300">TTRPG Tools</p>
              </div>
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-md bg-moss-800/80 border border-moss-700/30 flex items-center justify-center text-moss-100"
              >
                ✕
              </button>
            </div>

            <NavList onClick={() => setOpen(false)} />

            {/* removed redundant Back to Home link - Home is already in the main nav */}
          </div>
        </div>
      )}
    </>
  );
}
