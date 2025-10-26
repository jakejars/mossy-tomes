'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  // Check if any generator page is active
  const isGeneratorsActive = pathname?.startsWith('/generators');

  // Keep track of whether the collapsible section is open
  const [isGeneratorsOpen, setIsGeneratorsOpen] = useState(isGeneratorsActive);
  
  // Effect to automatically open the dropdown if navigating directly to a generator page
  useEffect(() => {
    if (isGeneratorsActive) {
      setIsGeneratorsOpen(true);
    }
  }, [isGeneratorsActive]);

  // State for the mobile menu drawer
  const [open, setOpen] = useState(false);

  // --- Link Arrays ---
  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
  ];

  const generatorLinks = [
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

  // --- Reusable Navigation Component ---
  // Renders the list of links and the collapsible section
  // `onClick` is passed from mobile to close the drawer on navigation
  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      
      {/* Main Links (Home, Blog) */}
      {mainLinks.map(link => {
        const active = pathname === link.href;
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

      {/* Generators Collapsible Section */}
      <div>
        {/* THIS IS THE CHANGED ELEMENT */}
        {/* Changed from <Link> to <button> to prevent navigation */}
        <button
          type="button"
          onClick={() => {
            setIsGeneratorsOpen(!isGeneratorsOpen);
            // We DON'T call onClick?.() here, as that would close the mobile menu
          }}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
            isGeneratorsActive ? 'bg-moss-700 text-white' : 'text-moss-200 hover:bg-moss-800/50 hover:text-moss-100'
          }`}
        >
          <span>Generators</span>
          {/* Chevron Icon */}
          <svg
            className={`w-4 h-4 transform transition-transform ${isGeneratorsOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Collapsible Content */}
        <div className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isGeneratorsOpen ? 'max-h-96' : 'max-h-0'}`}>
          {generatorLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClick?.()} // This click *will* close the mobile menu
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-800/50 hover:text-moss-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );

  // --- JSX for Mobile and Desktop ---
  return (
    <>
      {/* Mobile hamburger button */}
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
          <Link href="/">
            <h2 className="font-serif text-2xl text-moss-50">Mossy Tomes</h2>
            <p className="text-sm text-moss-300">TTRPG Tools</p>
          </Link>
        </div>
        <NavList />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* Menu Content */}
          <div className="relative w-72 h-full bg-moss-900/95 border-r border-moss-700/30 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" onClick={() => setOpen(false)}>
                <h2 className="font-serif text-2xl text-moss-50">Mossy Tomes</h2>
                <p className="text-sm text-moss-300">TTRPG Tools</p>
              </Link>
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-md bg-moss-800/80 border border-moss-700/30 flex items-center justify-center text-moss-100"
              >
                ✕
              </button>
            </div>
            {/* Pass onClick to NavList to close drawer on link click */}
            <NavList onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
