# 🌿 Mossy Tomes

A sanctuary for storytellers, game masters, and worldbuilders seeking inspiration and practical tools for their tabletop adventures.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## Features

Mossy Tomes provides 9 powerful generators for TTRPG content creation:

- **📚 Books & Tomes** - Generate mysterious books, authors, and magical properties
- **🏪 Shops** - Create memorable shops with proprietors, aesthetics, and hooks
- **⚔️ Encounters** - Generate encounter seeds, random encounters, and chase complications
- **🗺️ Landmass** - Create islands, continents, and archipelagos with customizable terrain
- **💎 Loot** - Generate story loot and treasure hoards with atmosphere
- **👤 Character Names** - Authentic names from various cultures (Dwarf, Elf, Human, etc.)
- **🏠 Places of Interest** - Spawn taverns, libraries, ballrooms and other locales
- **📜 Quests** - Generate quest seeds and adventure situations
- **🏰 Settlements** - Create memorable settlement names and characteristics

### Key Features

✨ **Lock & Reroll** - Lock elements you like, reroll the rest
💾 **Local Storage** - Your customizations are saved in your browser
🎨 **Customizable Data** - Edit JSON data to fit your campaign
📋 **Copy to Clipboard** - Quickly copy generated content
🎭 **Beautiful UI** - Immersive mossy theme with particle effects
📱 **Responsive Design** - Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jakejars/mossy-tomes.git
cd mossy-tomes
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React hooks + localStorage
- **Animation**: Canvas-based particle system

## Project Structure

```
mossy-tomes/
├── app/                      # Next.js app directory
│   ├── generators/          # Generator pages
│   │   ├── books/
│   │   ├── encounters/
│   │   ├── landmass/
│   │   ├── loot/
│   │   ├── names/
│   │   ├── poi/
│   │   ├── quests/
│   │   ├── settlements/
│   │   └── shops/
│   ├── layout.tsx           # Root layout with sidebar
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── BackgroundAnimation.tsx
│   └── Sidebar.tsx
├── types/                   # TypeScript type definitions
│   └── generators.ts
└── public/                  # Static assets
```

## Customization

Each generator allows you to customize the underlying data:

1. Open any generator page
2. Click "Show Editor" in the customization panel
3. Edit the JSON data
4. Click "Save Data" to persist changes locally

Your customizations are stored in your browser's localStorage and will persist across sessions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Test generators before submitting PRs
- Update types in `types/generators.ts` when needed

## Roadmap

- [ ] NPC generator with personalities and backstories
- [ ] Dungeon generator with room descriptions
- [ ] Export generators to PDF
- [ ] Share generated content via URL
- [ ] User accounts with cloud sync
- [ ] Mobile app (PWA support)
- [ ] More cultural name options
- [ ] Weather and travel generators

## License

MIT License - feel free to use this project for your campaigns!

## Acknowledgments

- Built for the TTRPG community
- Inspired by classic worldbuilding tools and random tables
- Designed with love for storytelling

---

**Happy worldbuilding!** 🎲✨
