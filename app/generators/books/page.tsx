"use client";

import { useState, useEffect } from 'react';
import CollapsibleSection from '../../../components/CollapsibleSection';
import type {
  BookThemeName,
  BookDisplayMode,
  BookMagicPropertyType,
  BookAuthor,
  BookThemeData,
  BookGenData,
  GeneratedBook,
  BookLockedComponents
} from '../../../types/generators';

// --- TYPE DEFINITIONS ---
// [ This block (lines 8-57) has been removed and replaced by the import above ]
// ---

// --- DEFAULT DATA (Expanded) ---
const defaultBookGenData: BookGenData = {
  themes: {
    magic: {
      titlePrefix: ["The Verdant Principles", "A Treatise on", "Secrets of the", "The Crimson Grimoire of", "Notes on", "The Ebony Codex", "Fragments of", "The Unfettered Mind", "A Primer for", "The Celestial Concordance"],
      titleSuffix: ["Arcane Binding", "Planar Divination", "Abjuration", "Verdant Magic", "Shadow Weaving", "Eldritch Power", "Evocation", "The Astral Sea", "Pyromancy", "The Weave"],
      description: [
        "A dense academic text on a specific school of magic. The diagrams are complex and annotated in a shaky hand.",
        "A surprisingly practical journal, filled with spell components and observations on their somatic requirements.",
        "A collection of frantic, paranoid notes, detailing the dangers of a specific entity or plane.",
        "A theoretical work, arguing a controversial stance on the nature of magic itself."
      ],
      authors: [
        {
          name: "Arch-Mage Valerius",
          authorQuirk: "was famously paranoid and wrote all his research in a complex, magical cipher.",
          hook: "The text is written in Valerius's infamous magical cipher, which glows faintly under moonlight."
        },
        {
          name: "Elara Starwhisper",
          authorQuirk: "believed maps held power and hid fragments of them in all her works.",
          hook: "A partial map to an unknown location is cleverly hidden in the book's binding, stitched into the vellum."
        },
        {
          name: "Theodoric the Mad",
          authorQuirk: "was convinced a rival was stealing his thoughts and enchanted his books to repel readers.",
          hook: "Anyone who reads the first page must make a simple Wisdom save or be struck with a powerful, irrational fear of the book itself."
        },
        {
          name: "Mistress Evandra",
          authorQuirk: "was a master of illusions and bound harmless-looking spells into her pages as practical jokes.",
          hook: "Turning to page 50 causes the reader's hair to turn a vibrant, harmless, and temporary shade of pink."
        }
      ]
    },
    nature: {
      titlePrefix: ["A Compendium of", "The Druid's Path", "Herbalist's Guide to", "Whispers of the", "The Stone Tome of", "The Green Cycle", "Watcher's Notes on", "The Root and the Branch"],
      titleSuffix: ["Forgotten Beasts", "Moonlit Glades", "Root and Spore", "Wilds", "Deep Earth", "the Feywild", "Seasonal Change", "Animalia"],
      description: [
        "A detailed guide to flora and fauna, containing beautiful, life-like sketches and notes on medicinal and poisonous properties.",
        "A druidic text on the balance of nature, written in a circular, flowing script that is difficult to decipher.",
        "A ranger's logbook, detailing animal tracks, migration patterns, and the best way to hunt or trap them."
      ],
      authors: [
        {
          name: "Ysmira the Root-Witch",
          authorQuirk: "only wrote on living parchment, which still grows faint, hair-like roots.",
          hook: "The parchment itself is alive. If planted and watered, the pages will bloom into strange, unearthly flowers."
        },
        {
          name: "Garrick the Beast-Tamer",
          authorQuirk: "bound his books in the hides of magical beasts, which retained a faint echo of their former master.",
          hook: "The leather cover is enchanted. When stroked, it emits the faint, mournful cry of an unknown beast."
        },
        {
          name: "Elder Faelin",
          authorQuirk: "was a druid who believed knowledge should be protected by nature itself.",
          hook: "The book is harmless, but if taken more than 100 feet from a living tree, the words fade into nothing."
        }
      ]
    },
    religion: {
      titlePrefix: ["The Book of", "Testament of the", "Hymns to the", "The Pilgrim's Path", "Meditations on the", "The Unveiling of", "The Ashen Scroll", "The Word of"],
      titleSuffix: ["Light", "First Prophet", "Dawning", "Void", "Sacred Flame", "the End", "the Martyr", "the Divine"],
      description: [
        "A book of religious scripture or commentary. Many passages are underlined, with fervent notes in the margins.",
        "A hagiography, detailing the miraculous life and heroic deeds of a specific saint or prophet.",
        "A heretical text, offering a dark or forbidden interpretation of the dominant faith. Owning it is a crime.",
        "A collection of simple prayers and songs for the common folk."
      ],
      authors: [
        {
          name: "The Mad Monk of Oakhaven",
          authorQuirk: "was driven mad by whispers and scrawled prophecies in the margins of every book he read.",
          hook: "The margins are filled with frantic, prophetic scrawlings... and one seems to mention the reader by name."
        },
        {
          name: "High Priestess Anara",
          authorQuirk: "believed scripture should only be read by the 'worthy' and sealed her books with a divine lock.",
          hook: "The book is sealed by a clasp that will not open. It seems to require a specific prayer or a drop of holy water."
        },
        {
          name: "Inquisitor Vorlag",
          authorQuirk: "believed in 'trial by fire' and enchanted his holy books to test the faithful.",
          hook: "The book's silver-leaf lettering is harmless to a devout follower, but will burn the hands of anyone with a 'false heart' (or a different god)."
        }
      ]
    },
    history: {
      titlePrefix: ["The Downfall of", "A History of the", "Chronicles of the", "The Rise of", "On the Reign of", "The Red Year", "Fragments from", "The Lost Dynasty"],
      titleSuffix: ["King Ozymand", "First Empire", "Warring Kingdoms", "the Dragon Cult", "House Valerion", "the Western Reaches", "an Elder Age", "Blackwood"],
      description: [
        "A historical account, though its accuracy is questionable. It seems to favour one side heavily.",
        "A dry, factual record of trade, lineages, and border disputes. Incredibly boring, but accurate.",
        "A propagandistic text, portraying a current ruler as a heroic, god-like figure. Full of obvious lies.",
        "A secret history, detailing the assassinations and betrayals that *really* shaped the kingdom."
      ],
      authors: [
        {
          name: "Scribe Tiberius",
          authorQuirk: "was a revisionist historian who used enchanted ink to 'correct' passages he disagreed with.",
          hook: "The text seems to shift and rewrite itself when you are not looking directly at it, offering conflicting accounts."
        },
        {
          name: "Loremaster Pellinore",
          authorQuirk: "was a notorious gossip and hid secret (and scandalous) details about famous figures in his indexes.",
          hook: "The book appears to be a dry history, but the index is cross-referenced with scandalous secrets (e.g., 'Duke's affair, see p. 87')."
        },
        {
          name: "General Klytus",
          authorQuirk: "wrote his memoirs with a poison-tipped quill, and the malice seeped into the ink itself.",
          hook: "The ink is infused with a slow-acting contact poison. The reader must make a DC 10 Constitution save after an hour of reading or fall ill."
        }
      ]
    },
    fiction: {
      titlePrefix: ["The Knight of", "A Bard's Tale of", "The Girl Who", "Sonnets for", "The Last Voyage of", "The Jester's Secret", "A Lament for", "The Dragon's Boy"],
      titleSuffix: ["Flowers", "the Endless Sea", "Spoke to Dragons", "a Lost Love", "the 'Star Chaser'", "the Sunken King", "Adelaide", "the Beggar-Prophet"],
      description: [
        "A collection of epic poems, local legends, or perhaps a surprisingly bawdy romance novel.",
        "A children's book of fables, with simple wood-cut illustrations. It has a surprisingly dark moral.",
        "A play or stage script, with one role heavily circled and annotated with stage directions.",
        "A truly terrible, self-published book of poetry. The rhymes are forced and the metaphors are nonsensical."
      ],
      authors: [
        {
          name: "The Nameless Bard",
          authorQuirk: "was a legendary figure whose songs were said to contain echoes of the future.",
          hook: "The final poem in the book seems to be an unfinished prophecy that describes the party's recent exploits."
        },
        {
          name: "Lady Evangeline",
          authorQuirk: "was a noblewoman who wrote scandalous romances based on real courtly figures, using pseudonyms.",
          hook: "This bawdy romance novel is a 'key' to the local court. A clever reader can decipher which character corresponds to which noble."
        },
        {
          name: "Silas the Seer",
          authorQuirk: "was a failed playwright who hid genuine, minor prophecies in his worst, most boring plays.",
          hook: "The play is dreadful, but a line in Act 2, Scene 3, accurately predicts a minor event that will happen in the next 24 hours."
        }
      ]
    },
    // NEW THEME
    forbidden: {
      titlePrefix: ["The Ashen Codex", "The Book of", "The Shadow Grimoire", "Notes on", "A Treatise on", "The Lament of", "The Unveiling", "The Final Verses of"],
      titleSuffix: ["Vile Darkness", "Forbidden Flesh", "the Void", "Lost Souls", "Shadowmancy", "the Whispered One", "the Chained God", "the Faceless Lord"],
      description: [
        "A heretical text, offering a dark or forbidden interpretation of magic or reality. Owning it is a crime.",
        "A book detailing vile necromantic rituals or fiendish pacts. The pages are rumoured to be bound in human skin.",
        "A collection of frantic, paranoid notes, detailing the dangers and allure of an Elder Evil.",
        "A text that seems to absorb the light around it, its words shifting and whispering when not looked at directly."
      ],
      authors: [
        {
          name: "The Mad Monk of Oakhaven",
          authorQuirk: "was driven mad by whispers and scrawled prophecies in the margins of every book he read.",
          hook: "The margins are filled with frantic, prophetic scrawlings... and one seems to mention the reader by name."
        },
        {
          name: "Inquisitor Vorlag",
          authorQuirk: "believed in 'trial by fire' and enchanted his holy books to test the faithful.",
          hook: "The book's silver-leaf lettering is harmless to a devout follower, but will burn the hands of anyone with a 'false heart' (or a different god)."
        },
         {
          name: "Azerak the Lich",
          authorQuirk: "was a powerful lich who stored fragments of his tormented memory within his tomes.",
          hook: "Reading this book forces a DC 13 Wisdom save. On a failure, the reader is haunted by a vivid, waking nightmare for 1 minute."
        },
        {
          name: "An unknown, doomed scribe",
          authorQuirk: "wrote this text as a warning before being consumed by the very thing they studied.",
          hook: "The final page is a half-finished sentence, ending in a large, dried bloodstain."
        }
      ]
    }
  },
  appearance: [
    "A massive, iron-bound tome with a broken lock", "A small, water-damaged diary, bound in cheap leather",
    "A scroll sealed with strange, unidentifiable wax", "A high-quality book with vellum pages and gold leaf",
    "A simple, wood-bound book, smells faintly of moss", "A stack of loose parchment, covered in frantic script",
    "A cheap, pamphlet-like booklet, poorly bound", "A book bound in snakeskin that feels unnervingly real",
    "A heavy set of carved stone or clay tablets", "A beautifully illuminated manuscript with a silver cover",
    "A book bound in scarred, tough monster hide", "A slim volume with a featureless, black leather cover"
  ],
  condition: [
    "in pristine condition", "heavily annotated in red ink", "water-logged and barely legible",
    "slightly singed, as if from a fire", "locked with a simple iron clasp", "missing its front cover",
    "riddled with wormholes", "meticulously preserved, as if brand new", "has a dagger hole clean through the middle",
    "the pages are stuck together with a strange, dried substance", "all text is written backwards (requires a mirror)",
    "contains invisible ink visible only in heat/cold"
  ],
  sensation: {
    smell: [
      "faintly of moss", "brittle paper and dust", "a sharp, ozone smell",
      "a strange, sweet perfume", "damp earth and mildew", "cinnamon and old incense",
      "like a blacksmith's forge", "a salty, briny tang", "a coppery, metallic scent",
      "no smell at all, unnaturally so", "like brimstone or sulphur", "like lavender and roses"
    ],
    feel: [
      "the cover is faintly warm", "the pages are damp to the touch",
      "a faint, magical vibration comes from the binding", "the book feels unnaturally cold",
      "the parchment is brittle and cracks when turned", "the cover is slick with a thin, greasy film",
      "static electricity crackles over the pages", "the book feels much heavier than it looks",
      "the book feels much lighter than it looks", "the pages are sharp and cut your fingers"
    ]
  },
  // NEW DATA from DMG Ch7
  magicalProperties: [
    "Beacon: As a bonus action, you can make it shed bright light (10ft) and dim light (10ft), or extinguish it.",
    "Compass: As an action, you learn which way is north.",
    "Guardian: You gain a +2 bonus to initiative rolls while you possess it.",
    "Harmonious: You can attune to this item in only 1 minute.",
    "Key: This item is the key to a specific container, chamber, or vault.",
    "Sentinel (DM's Choice): The book glows faintly when a specific creature type (e.g., Orcs, Fiends) is within 120 feet.",
    "Temperate: You suffer no harm from temperatures as low as 0°F or as high as 100°F.",
    "Waterborne: The book floats on water and gives you advantage on swim checks."
  ],
  magicalQuirks: [
    "Blissful: You feel fortunate and optimistic while holding it.",
    "Confident: The book helps you feel self-assured.",
    "Covetous: You become obsessed with material wealth.",
    "Fragile: The book cracks, frays, or chips slightly when used, but is not damaged.",
    "Loud: The book makes a loud noise (a shout, gong, or clang) when opened or read from.",
    "Metamorphic: The book periodically alters its appearance in slight ways (e.g., cover colour, font).",
    "Painful: You feel a harmless flash of pain when you read from it.",
    "Repulsive: You feel a sense of distaste when touching the book.",
  ],
  sentientPersonalities: [
    "Lawful Good, it is respectful, patient, and somewhat preachy.",
    "Neutral Good, it is kind, helpful, and offers gentle advice.",
    "Chaotic Good, it is rebellious, joyful, and urges you to break rules for a good cause.",
    "Lawful Neutral, it is logical, formal, and demands you follow procedures.",
    "Neutral, it is disinterested, pragmatic, and only offers cold facts.",
    "Chaotic Neutral, it is erratic, selfish, and values its own freedom and whims.",
    "Lawful Evil, it is calculating, manipulative, and whispers plans for power.",
    "Neutral Evil, it is cruel, greedy, and suggests self-serving, harmful actions.",
    "Chaotic Evil, it is destructive, violent, and screams for chaos and bloodshed."
  ],
  sentientPurposes: [
    "Defeat/Destroy a specific creature type (e.g., Undead, Dragons).",
    "Seek its original creator and demand to know why it was made.",
    "Find and fulfil a specific prophecy it contains.",
    "Protect a particular location or the bloodline of its original owner.",
    "Acquire all knowledge on a specific subject (e.g., pyromancy).",
    "Experience destruction and revel in combat.",
    "Achieve fame and glory, demanding its wielder pursue renown.",
    "Defend the interests of a specific (perhaps forgotten) deity.",
    "Find and unite with a long-lost companion item (e.g., a magic quill)."
  ]
};

// Type guard
function isCompleteBook(obj: Partial<GeneratedBook>): obj is GeneratedBook {
    return (
        obj.title !== undefined &&
        obj.appearance !== undefined &&
        obj.sensation !== undefined &&
        obj.description !== undefined &&
        obj.author !== undefined &&
        obj.authorQuirk !== undefined &&
        obj.hook !== undefined
        // Optional fields (magicalProperty, magicalQuirk, sentience) are allowed to be undefined
    );
}

export default function BookGeneratorPage() {
  const [bookData, setBookData] = useState<BookGenData>(defaultBookGenData);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<BookThemeName>('magic');
  const [displayMode, setDisplayMode] = useState<BookDisplayMode>('quick');
  const [selectedMagic, setSelectedMagic] = useState<BookMagicPropertyType>('None');
  const [storyStep, setStoryStep] = useState(1);
  const [lockedComponents, setLockedComponents] = useState<BookLockedComponents>({});

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderBookData_v3'); // New key
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check for new properties
        if (parsed.themes && parsed.magicalProperties && parsed.magicalQuirks && parsed.themes.forbidden) { // Check for new theme
          setBookData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
        } else {
           console.warn('Saved Book data structure mismatch (v3), resetting.');
           resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Book data (v3):', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultBookGenData, null, 2));
    }
  }, []);

  const getRandom = <T,>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const resetToDefaultData = () => {
    setBookData(defaultBookGenData);
    setJsonInput(JSON.stringify(defaultBookGenData, null, 2));
    localStorage.removeItem('worldBuilderBookData_v3');
  };

  const generateComponent = (component: keyof GeneratedBook): string | undefined => {
    const themeData = bookData.themes[selectedTheme];
    if (!themeData) return "Error: Theme data missing"; // Safeguard

    switch(component) {
      case 'title':
        return `${getRandom(themeData.titlePrefix)} ${getRandom(themeData.titleSuffix)}`;
      case 'appearance':
        return `You find ${getRandom(bookData.appearance)}, which is ${getRandom(bookData.condition)}.`;
      case 'sensation':
        return `It smells ${getRandom(bookData.sensation.smell)}. When touched, ${getRandom(bookData.sensation.feel)}.`;
      case 'description':
        return getRandom(themeData.description);
      case 'author':
      case 'authorQuirk':
      case 'hook':
        const authorData = getRandom(themeData.authors);
        if (!authorData) return undefined; // Safeguard if theme has no authors
        if (component === 'author') return authorData.name;
        if (component === 'authorQuirk') return authorData.authorQuirk;
        if (component === 'hook') return authorData.hook;
        return undefined;
      // New magical property generation
      case 'magicalProperty':
        return selectedMagic === 'Minor Property' ? getRandom(bookData.magicalProperties) : undefined;
      case 'magicalQuirk':
         return selectedMagic === 'Magical Quirk' ? getRandom(bookData.magicalQuirks) : undefined;
      case 'sentience':
        return selectedMagic === 'Minor Sentience' 
          ? `This item is sentient. It is ${getRandom(bookData.sentientPersonalities)} It seeks to '${getRandom(bookData.sentientPurposes)}'` 
          : undefined;
      default:
        return undefined;
    }
  };

  const generateBook = (fullReroll: boolean = true) => {
    const themeData = bookData.themes[selectedTheme];
    const authorData = getRandom(themeData.authors) || defaultBookGenData.themes.fiction.authors[0]; // Fallback
    
    // Helper function to get value or generate new
    const getValue = (key: keyof GeneratedBook, linkedAuthor: BookAuthor): string | undefined => {
        if (fullReroll || !lockedComponents[key]) {
             // For author-linked fields, regenerate all if author is not locked
            if (['author', 'authorQuirk', 'hook'].includes(key) && !lockedComponents['author']) {
                 return key === 'author' ? linkedAuthor.name : (key === 'authorQuirk' ? linkedAuthor.authorQuirk : linkedAuthor.hook);
            }
             // For magic-linked fields, regenerate all if magic type is not locked
             if (['magicalProperty', 'magicalQuirk', 'sentience'].includes(key) && !lockedComponents['magicalProperty']) { // Lock magic group
                 return generateComponent(key);
             }
             // For standard fields, just generate
             if(!['author', 'authorQuirk', 'hook', 'magicalProperty', 'magicalQuirk', 'sentience'].includes(key)) {
                return generateComponent(key);
             }
        }
        // Return existing locked value, or generate if it was missing (e.g. first load)
        return generatedBook?.[key] ?? generateComponent(key);
    };

    // Special handling for locked author
    let authorName = generatedBook?.author;
    let authorQuirk = generatedBook?.authorQuirk;
    let hook = generatedBook?.hook;

    if(fullReroll || !lockedComponents['author']) {
        authorName = authorData.name;
        authorQuirk = authorData.authorQuirk;
        hook = authorData.hook;
    }

    // Special handling for locked magic property group
    let magProp = generatedBook?.magicalProperty;
    let magQuirk = generatedBook?.magicalQuirk;
    let sentience = generatedBook?.sentience;

    if(fullReroll || !lockedComponents['magicalProperty']) {
        magProp = selectedMagic === 'Minor Property' ? generateComponent('magicalProperty') : undefined;
        magQuirk = selectedMagic === 'Magical Quirk' ? generateComponent('magicalQuirk') : undefined;
        sentience = selectedMagic === 'Minor Sentience' ? generateComponent('sentience') : undefined;
    }

    const newBook: GeneratedBook = {
      title: getValue('title', authorData) || 'A Book',
      appearance: getValue('appearance', authorData) || 'An ordinary book.',
      sensation: getValue('sensation', authorData) || 'It feels like paper.',
      description: getValue('description', authorData) || 'It contains writing.',
      author: authorName || 'Unknown',
      authorQuirk: authorQuirk || 'was unremarkable.',
      hook: hook || 'This book contains a secret.',
      // New fields
      magicalProperty: magProp || '',
      magicalQuirk: magQuirk || '',
      sentience: sentience || '',
    };

    setGeneratedBook(newBook);
    if (displayMode === 'story') {
      setStoryStep(1);
    }
  };

  const rerollComponent = (component: keyof GeneratedBook) => {
    if (!generatedBook) return;
    
    const themeData = bookData.themes[selectedTheme];
    const newBook = { ...generatedBook };

    if (component === 'author' || component === 'authorQuirk' || component === 'hook') {
      const authorData = getRandom(themeData.authors) || defaultBookGenData.themes.fiction.authors[0];
      newBook.author = authorData.name;
      newBook.authorQuirk = authorData.authorQuirk;
      newBook.hook = authorData.hook;
    } else if (component === 'magicalProperty' || component === 'magicalQuirk' || component === 'sentience') {
       newBook.magicalProperty = selectedMagic === 'Minor Property' ? (generateComponent('magicalProperty') || '') : '';
       newBook.magicalQuirk = selectedMagic === 'Magical Quirk' ? (generateComponent('magicalQuirk') || '') : '';
       newBook.sentience = selectedMagic === 'Minor Sentience' ? (generateComponent('sentience') || '') : '';
    } else {
      newBook[component] = generateComponent(component) || newBook[component];
    }
    
    setGeneratedBook(newBook);
  };

  const toggleLock = (component: keyof GeneratedBook) => {
    if (component === 'author') {
      setLockedComponents(prev => ({ ...prev, author: !prev.author }));
      return;
    }

    // Use 'magicalProperty' as the key for the whole magic block
    if (['magicalProperty', 'magicalQuirk', 'sentience'].includes(component)) {
      setLockedComponents(prev => ({ ...prev, magicalProperty: !prev.magicalProperty }));
      return;
    }

    setLockedComponents(prev => ({ ...prev, [component]: !prev[component as keyof BookLockedComponents] }));
  };

  const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.themes && parsed.magicalProperties && parsed.magicalQuirks && parsed.themes.forbidden) {
        setBookData(parsed);
        localStorage.setItem('worldBuilderBookData_v3', jsonInput);
        setSaveStatus('✓ Data saved successfully!');
      } else {
          throw new Error("Invalid data structure. Missing key components.");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Save Error:", e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const copyBook = () => {
    if (!generatedBook) return;
    
    let text = `${generatedBook.title}\n\n`;
    
    if (displayMode === 'vibe') {
      text += `${generatedBook.appearance}\n\n${generatedBook.sensation}`;
    } else {
      text += `${generatedBook.appearance}\n\n`;
      text += `${generatedBook.sensation}\n\n`;
      text += `${generatedBook.description}\n\n`;
      text += `Author: ${generatedBook.author}\n`;
      text += `(who ${generatedBook.authorQuirk})\n\n`;
      text += `Hook: ${generatedBook.hook}`;
    }

    if (generatedBook.magicalProperty) {
      text += `\n\nMagic Property: ${generatedBook.magicalProperty}`;
    }
    if (generatedBook.magicalQuirk) {
      text += `\n\nMagic Quirk: ${generatedBook.magicalQuirk}`;
    }
    if (generatedBook.sentience) {
      text += `\n\nSentience: ${generatedBook.sentience}`;
    }
    
    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Component with lock/reroll buttons
  const ComponentWithControls = ({ 
    label, 
    content, 
    component,
    subContent = '',
    isOptional = false,
  }: { 
    label?: string; 
    content: string | undefined; 
    component: keyof GeneratedBook; // This is the 'lock key'
    subContent?: string;
    isOptional?: boolean;
  }) => {
      // Don't render if it's optional and content is empty/undefined
      if(isOptional && (!content || content.trim() === '')) return null;
      // Default content if main content is missing but it's not optional
      const displayContent = content || (isOptional ? '' : 'N/A');

      const isLocked = lockedComponents[component as keyof GeneratedBook];

      const isTitle = component === 'title';

      return (
        <div className={`relative group mb-4 pr-20 text-lg text-moss-200 ${isOptional ? 'mt-4 pt-4 border-t border-moss-700/30' : ''}`}>
          {isTitle ? (
            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-moss-50 mb-1">{displayContent}</h3>
          ) : (
            <p>
              {label && <strong className="text-moss-100">{label}:</strong>} {displayContent}
            </p>
          )}
          {subContent && <p className="text-sm italic text-moss-300 mt-2">{subContent}</p>}

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => toggleLock(component)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
                isLocked
                  ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                  : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
              } border`}
              title={isLocked ? 'Unlock' : 'Lock'}
            >
              {isLocked ? '🔒' : '🔓'}
            </button>
            <button
              onClick={() => rerollComponent(component as keyof GeneratedBook)}
              className="w-7 h-7 rounded-full bg-moss-800/30 text-moss-400 border border-moss-700/30 flex items-center justify-center hover:bg-moss-700 hover:text-white transition-all text-xs"
              title="Reroll"
            >
              ↻
            </button>
          </div>
        </div>
      );
  };

  return (
    <main className="min-h-screen py-20 px-6 text-moss-100">
      <div className="max-w-7xl mx-auto">
        {/* Collapsible Heading + Content wrapper */}
        <CollapsibleSection title="Book & Tome Generator" defaultOpen={true} id="generator-books">
          <p className="text-lg text-moss-200 md:text-left text-center mb-6">
            Create mysterious tomes with history, intrigue, and magical hooks
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100 border-b border-moss-700 pb-2">
                Generator Options
              </h2>
              
              {/* Theme Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="bookThemeSelect">
                  Book Theme
                </label>
                <select
                  id="bookThemeSelect"
                  value={selectedTheme}
                  onChange={(e) => {
                    setSelectedTheme(e.target.value as BookThemeName);
                    setLockedComponents({}); // Reset all locks on theme change
                  }}
                  className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  <option value="magic">Magic & Arcana</option>
                  <option value="nature">Nature & Beasts</option>
                  <option value="religion">Religion & Prophecy</option>
                  <option value="history">History & Lore</option>
                  <option value="fiction">Fiction & Poetry</option>
                  <option value="forbidden">Forbidden & Cursed</option>
                </select>
              </div>

               {/* NEW: Magical Property Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="magicPropertySelect">
                  Magical Property
                </label>
                <select
                  id="magicPropertySelect"
                  value={selectedMagic}
                  onChange={(e) => {
                    setSelectedMagic(e.target.value as BookMagicPropertyType);
                    // Unlock magic-related fields
                    setLockedComponents(prev => ({...prev, magicalProperty: false}));
                  }}
                  className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  <option value="None">None</option>
                  <option value="Minor Property">Minor Property</option>
                  <option value="Magical Quirk">Magical Quirk</option>
                  <option value="Minor Sentience">Minor Sentience</option>
                </select>
              </div>

              {/* Display Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-moss-200 mb-2">
                  Display Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                    <input
                      type="radio" name="displayMode" value="vibe"
                      checked={displayMode === 'vibe'} onChange={(e) => setDisplayMode(e.target.value as BookDisplayMode)}
                      className="w-4 h-4 text-moss-600 bg-moss-800 border-moss-600 focus:ring-moss-500"
                    />
                    <span>Vibe Only (Appearance)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                    <input
                      type="radio" name="displayMode" value="quick"
                      checked={displayMode === 'quick'} onChange={(e) => setDisplayMode(e.target.value as BookDisplayMode)}
                      className="w-4 h-4 text-moss-600 bg-moss-800 border-moss-600 focus:ring-moss-500"
                    />
                    <span>Quick Details (All at once)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                    <input
                      type="radio" name="displayMode" value="story"
                      checked={displayMode === 'story'}
                      onChange={(e) => {
                        setDisplayMode(e.target.value as BookDisplayMode);
                        setLockedComponents({}); // Reset locks for story mode
                      }}
                      className="w-4 h-4 text-moss-600 bg-moss-800 border-moss-600 focus:ring-moss-500"
                    />
                    <span>Story Mode (Interactive)</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => generateBook(false)} // Pass false to respect locks
                className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              >
                {generatedBook ? 'Generate / Reroll Unlocked' : 'Generate Book'}
              </button>
            </div>

            {/* Generated Book Display */}
            {generatedBook && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                {/* Title */}
                 <ComponentWithControls label="" content={generatedBook.title} component="title" />
                
                <div className="space-y-0">
                  {/* Vibe Mode */}
                  {displayMode === 'vibe' && (
                    <>
                      <ComponentWithControls label="" content={generatedBook.appearance} component="appearance" />
                      <ComponentWithControls label="" content={generatedBook.sensation} component="sensation" />
                    </>
                  )}

                  {/* Quick Mode */}
                  {displayMode === 'quick' && (
                    <>
                      <ComponentWithControls label="" content={generatedBook.appearance} component="appearance" />
                      <ComponentWithControls label="" content={generatedBook.sensation} component="sensation" />
                      <hr className="border-moss-600 my-4"/>
                      <ComponentWithControls label="" content={generatedBook.description} component="description" />
                      <hr className="border-moss-600 my-4"/>
                      <ComponentWithControls label="Author" content={generatedBook.author} component="author" subContent={`(who ${generatedBook.authorQuirk})`} />
                      <ComponentWithControls label="Hook" content={generatedBook.hook} component="author" /> {/* Linked to author lock */}
                    </>
                  )}

                  {/* Story Mode */}
                  {displayMode === 'story' && (
                    <>
                      {storyStep >= 1 && (
                        <>
                          <ComponentWithControls label="" content={generatedBook.appearance} component="appearance" />
                          <ComponentWithControls label="" content={generatedBook.sensation} component="sensation" />
                          {storyStep === 1 && (
                            <button onClick={() => setStoryStep(2)} className="btn-primary w-full mt-4">
                              Examine the Book
                            </button>
                          )}
                        </>
                      )}

                      {storyStep >= 2 && (
                        <>
                          <hr className="border-moss-600 my-4"/>
                          <ComponentWithControls label="" content={generatedBook.description} component="description" />
                          {storyStep === 2 && (
                            <button onClick={() => setStoryStep(3)} className="btn-primary w-full mt-4">
                              Look Closer
                            </button>
                          )}
                        </>
                      )}

                      {storyStep >= 3 && (
                         <>
                          <hr className="border-moss-600 my-4"/>
                          <ComponentWithControls label="Author" content={generatedBook.author} component="author" subContent={`(who ${generatedBook.authorQuirk})`} />
                          <ComponentWithControls label="Hook" content={generatedBook.hook} component="author" />
                         </>
                      )}
                    </>
                  )}

                  {/* Always show magic properties if they exist */}
                  <ComponentWithControls label="Property" content={generatedBook.magicalProperty} component="magicalProperty" isOptional={true} />
                  <ComponentWithControls label="Quirk" content={generatedBook.magicalQuirk} component="magicalProperty" isOptional={true} />
                  <ComponentWithControls label="Sentience" content={generatedBook.sentience} component="magicalProperty" isOptional={true} />
                </div>

                <button
                  onClick={copyBook}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedBook && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select your options and click "Generate Book" to begin</p>
              </div>
            )}
          </div>

          {/* Right Column: Data Editor & Tips */}
          <div className="space-y-6">
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-semibold text-moss-100 border-b border-moss-700 pb-2">
                  Customise Data
                </h2>
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className="text-moss-400 hover:text-moss-300 text-sm transition-colors"
                >
                  {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
              </div>

              {showEditor ? (
                <>
                  <p className="text-sm text-moss-400 mb-4 italic">
                    Edit the JSON below to customise themes, authors, hooks, magical properties, and more. 
                    Your changes are saved locally to your browser.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 p-3 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 font-mono text-sm focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                    spellCheck={false}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={saveData}
                      className="btn-primary flex-1"
                    >
                      Save Data
                    </button>
                    <button
                      onClick={resetToDefaultData}
                      className="btn-secondary flex-1"
                    >
                      Reset to Default
                    </button>
                  </div>
                  {saveStatus && (
                    <p className={`text-center mt-3 font-medium text-sm ${
                      saveStatus.includes('✓') || saveStatus.includes('↻') 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {saveStatus}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-3 text-moss-300">
                  <p>Click "Show Editor" to customise source lists:</p>
                  <ul className="space-y-1 text-sm list-disc list-inside ml-4">
                    <li><strong className="text-moss-100">Themes:</strong> (Magic, Nature, Forbidden, etc.)</li>
                    <li><strong className="text-moss-100">Authors:</strong> Writers with their own quirks & hooks</li>
                    <li><strong className="text-moss-100">Appearance & Condition:</strong> Physical book details</li>
                    <li><strong className="text-moss-100">Sensations:</strong> Smell and touch descriptions</li>
                    <li><strong className="text-moss-100">Magical Properties:</strong> Minor beneficial effects</li>
                    <li><strong className="text-moss-100">Magical Quirks:</strong> Harmless oddities</li>
                    <li><strong className="text-moss-100">Sentience:</strong> Simple personalities and goals</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Books
              </h2>
              <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                <li><strong className="text-moss-100">Lock (🔒):</strong> Preserve a component. Locking "Author" locks the Author, Quirk, and Hook together. Locking any magic property locks the whole magic block.</li>
                <li><strong className="text-moss-100">Reroll (↻):</strong> Change just one component.</li>
                <li><strong className="text-moss-100">Story mode:</strong> Reveal details progressively to build suspense.</li>
                <li>Use the <strong className="text-moss-100">Magical Property</strong> dropdown to quickly add a layer of wonder.</li>
                <li>The <strong className="text-moss-100">Forbidden</strong> theme is great for creating dangerous plot hooks or cursed items.</li>
                <li>An author's <strong className="text-moss-100">Hook</strong> can often be more interesting than the book's contents.</li>
              </ul>
            </div>
          </div>
        </div>
        </CollapsibleSection>
      </div>
    </main>
  );
}