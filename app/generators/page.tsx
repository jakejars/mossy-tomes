import CollapsibleSection from '../../components/CollapsibleSection';
import Link from 'next/link';

export const metadata = {
  title: 'Generators — Mossy Tomes',
  description: 'All generators, articles, and worldbuilding content grouped for easy navigation.',
};

export default function GeneratorsIndex() {
  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-moss-950 to-gray-900 text-moss-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-moss-50 text-center">Content Hub</h1>

        <CollapsibleSection title="Generators" defaultOpen={true} id="section-generators">
          <p className="text-moss-200 mb-4">Quick tools to generate locations, NPCs, items, and more.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/generators/books" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Books & Tomes</h3>
              <p className="text-sm text-moss-300 mt-2">Generate mysterious books, authors, and hooks.</p>
            </Link>

            <Link href="/generators/shops" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Shops</h3>
              <p className="text-sm text-moss-300 mt-2">Create shops, stock, proprietors and story hooks.</p>
            </Link>

            <Link href="/generators/encounters" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Encounters</h3>
              <p className="text-sm text-moss-300 mt-2">Quick encounter ideas and stat blocks.</p>
            </Link>

            <Link href="/generators/loot" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Loot</h3>
              <p className="text-sm text-moss-300 mt-2">Generate treasure and trinkets with flavour.</p>
            </Link>

            <Link href="/generators/names" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Names</h3>
              <p className="text-sm text-moss-300 mt-2">Generate names for people, places, and things.</p>
            </Link>

            <Link href="/generators/landmass" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Landmass</h3>
              <p className="text-sm text-moss-300 mt-2">Create terrain, biomes, and simple map seeds.</p>
            </Link>

            <Link href="/generators/poi" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">POI</h3>
              <p className="text-sm text-moss-300 mt-2">Points of interest — landmarks, ruins, curiosities.</p>
            </Link>

            <Link href="/generators/quests" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Quests</h3>
              <p className="text-sm text-moss-300 mt-2">Quest seeds and hooks for quick session use.</p>
            </Link>

            <Link href="/generators/settlements" className="card p-4 hover:scale-105 transition-transform">
              <h3 className="font-semibold text-moss-100">Settlements</h3>
              <p className="text-sm text-moss-300 mt-2">Generate villages, towns, and city descriptors.</p>
            </Link>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Blog / Articles" defaultOpen={false} id="section-blog">
          <p className="text-moss-200 mb-3">Drafts and published articles covering worldbuilding, session prep, and GM advice.</p>
          <ul className="list-disc list-inside text-moss-300 space-y-1">
            <li>Adventures — long-form modules and seeds</li>
            <li>Homebrew Subclasses — player options</li>
            <li>House Rules — adjudication and balance notes</li>
            <li>Tips & Tricks — DM tools and table hacks</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Content" defaultOpen={false} id="section-content">
          <p className="text-moss-200 mb-3">Organise campaign assets and community contributions here.</p>
          <div className="space-y-2 text-moss-300">
            <p><strong>Adventures:</strong> Seeds and outlines for one-shots and arcs.</p>
            <p><strong>Homebrew Subclasses:</strong> Player-facing subclass content.</p>
            <p><strong>Home Rules:</strong> Optional mechanics and clarifications.</p>
            <p><strong>Tips & Tricks:</strong> Quick DM reference notes.</p>
          </div>
        </CollapsibleSection>
      </div>
    </main>
  );
}
