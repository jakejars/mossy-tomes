'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if any generator page (or the index) is active
  const isGeneratorPage = pathname.startsWith('/generators');
  
  // Start with the generator section open if a generator page is active
  const [generatorsOpen, setGeneratorsOpen] = useState(isGeneratorPage);

  // Effect to sync the collapsible state if the user navigates
  // e.g., clicks "Home" (closes) or navigates from Home to "Books" (opens)
  useEffect(() => {
    setGeneratorsOpen(isGeneratorPage);
  }, [isGeneratorPage, pathname]);

  const mainLinks = [
    { href: '/', label: 'Home' },
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

  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {/* Main Links */}
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
        <div className="flex items-center justify-between group">
          <Link
              href="/generators"
              onClick={(e) => {
                // This link *only* navigates.
                // The toggle button is separate.
                onClick?.(); // Close mobile menu if clicked
              }}
              className={`block flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                 isGeneratorPage 
                   ? 'text-white' 
                   : 'text-moss-200 group-hover:bg-moss-800/50 group-hover:text-moss-100'
              }`}
            >
              Generators
          </Link>
          <button
            onClick={() => setGeneratorsOpen(!generatorsOpen)}
            aria-label={generatorsOpen ? "Collapse Generators" : "Expand Generators"}
            className={`p-2 rounded-md text-sm font-medium transition-colors ${
              isGeneratorPage 
                ? 'text-white' 
                : 'text-moss-200 group-hover:bg-moss-800/50 group-hover:text-moss-100'
            }`}
          >
            <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${generatorsOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <div
          className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
            generatorsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {generatorLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClick?.()}
                className={`block pl-8 pr-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-moss-700 text-white' : 'text-moss-300 hover:bg-moss-800/50 hover:text-moss-200'
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

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
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
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
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
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-md bg-moss-800/80 border border-moss-700/30 flex items-center justify-center text-moss-100"
              >
                ✕
              </button>
            </div>

            <NavList onClick={() => setMobileOpen(false)} />

            {/* removed redundant Back to Home link - Home is already in the main nav */}
          </div>
        </div>
      )}
    </>
  );
}

