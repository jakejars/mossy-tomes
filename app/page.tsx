import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen py-20 px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-moss-50 drop-shadow-md">
            Welcome to <span className="text-moss-400">Mossy Tomes</span>
          </h1>
          <p className="text-xl md:text-2xl text-moss-200 max-w-3xl mx-auto leading-relaxed">
            A sanctuary for storytellers, game masters, and worldbuilders seeking inspiration 
            and practical tools for their tabletop adventures.
          </p>
        </div>

        {/* Generator Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <GeneratorCard
            title="Landmass Generator"
            description="Create islands, continents, and archipelagos with customizable terrain and detail."
            href="/generators/landmass"
            icon="🗺️"
          />
          <GeneratorCard
            title="Character Names"
            description="Generate authentic character names from various cultures and styles with titles."
            href="/generators/names"
            icon="👤"
          />
          <GeneratorCard
            title="Settlement Names"
            description="Create memorable names for taverns, shops, cities, and other locations."
            href="/generators/settlements"
            icon="🏰"
          />
          <GeneratorCard
            title="Quest & Adventure Generator"
            description="Generate quest seeds and adventure situations for any level."
            href="/generators/quests"
            icon="📜"
          />
          <GeneratorCard
            title="Loot Generator"
            description="Create treasure hoards with atmosphere, intrigue, and story hooks."
            href="/generators/loot"
            icon="💎"
          />
          <GeneratorCard
            title="Places of Interest"
            description="Quickly spawn taverns, libraries, ballrooms and other memorable locales."
            href="/generators/poi"
            icon="🏠"
          />
          <GeneratorCard
            title="Books & Tomes"
            description="Generate mysterious books, their authors, and magical curiosities."
            href="/generators/books"
            icon="📚"
          />
        </div>

        {/* Additional Sections */}
        <div className="space-y-8">
          <Section
            title="For Game Masters"
            content="Discover generators for NPCs, encounters, treasures, and plot hooks. Keep your sessions fresh and your players engaged with tools designed for improvisation and planning alike."
          />
          <Section
            title="For Players"
            content="Explore character inspiration, backstory generators, and quick reference tools to enhance your roleplay and deepen your connection to the world."
          />
          <Section
            title="For Worldbuilders"
            content="Access your personal wiki, build rich histories, and maintain consistency across your campaigns. Share your world with your table or keep it as your private codex."
          />
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-moss-100 animate-pulse">
            More Tools Coming Soon
          </h2>
          <p className="text-moss-300">
            NPC generators, quest builders, treasure tables, and your personal worldbuilding wiki.
          </p>
        </div>
      </div>
    </main>
  );
}

function GeneratorCard({ title, description, href, icon }: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href}>
      <div className="card p-6 bg-moss-800/50 border border-moss-700/20 rounded-xl backdrop-blur-sm hover:border-moss-500/40 transition-all duration-300 h-full group cursor-pointer">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-serif text-xl font-semibold mb-3 text-moss-100 group-hover:text-moss-400 transition-colors">
          {title}
        </h3>
        <p className="text-moss-300 leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-moss-500 group-hover:text-moss-400 transition-colors flex items-center">
          <span className="mr-2">Open Generator</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="card p-8 bg-moss-800/60 border border-moss-700/30 rounded-lg shadow-md">
      <h2 className="font-serif text-2xl font-semibold mb-4 text-moss-100">
        {title}
      </h2>
      <p className="text-moss-200 leading-relaxed text-lg">
        {content}
      </p>
    </div>
  );
}

