"use client";

import React, { useState, KeyboardEvent } from 'react';

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  id?: string;
};

export default function CollapsibleSection({ title, defaultOpen = true, children, id }: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const toggle = () => setOpen((v) => !v);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <section className="mb-10">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKey}
        className="flex items-center justify-between cursor-pointer select-none text-center md:text-left"
      >
        <h2 id={id} className="font-serif text-4xl md:text-5xl font-bold mb-2 text-moss-50">
          {title}
        </h2>
        <div className="ml-4">
          <button
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-moss-800/30 text-moss-200 hover:bg-moss-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`mt-4 transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </section>
  );
}
