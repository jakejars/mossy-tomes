"use client";

import { useState, useEffect } from 'react';

// --- Interface Definitions ---
interface ShopNameParts {
  [key: string]: string[];
}

interface ShopNotableItems {
  [key: string]: string[];
}

// NEW: Interface for Stock Levels
interface ShopStockLevels {
  [key: string]: { // Shop Type (e.g., "Smithy")
    "Village": string[]; // Wealth Level
    "Town": string[];
    "City": string[];
  };
}

interface ShopGenData {
  shopTypes: string[];
  wealthLevels: SettlementWealth[]; // Added
  namePrefix: ShopNameParts;
  nameSuffix: ShopNameParts;
  proprietor: string[];
  aesthetic: string[];
  notableItem: ShopNotableItems;
  stockLevel: ShopStockLevels; // Added
  conflict: string[];
}

interface GeneratedShop {
  name: string; // Mandatory
  type: string;
  wealth: SettlementWealth; // Added
  proprietor: string;
  aesthetic: string;
  stockLevel: string; // Added
  notableItem: string;
  conflict: string;
}

// Added new fields to type guard
function isCompleteShop(obj: Partial<GeneratedShop>): obj is GeneratedShop {
    return (
        obj.name !== undefined &&
        obj.type !== undefined &&
        obj.wealth !== undefined && // Added
        obj.proprietor !== undefined &&
        obj.aesthetic !== undefined &&
        obj.stockLevel !== undefined && // Added
        obj.notableItem !== undefined &&
        obj.conflict !== undefined
    );
}

type LockedComponents = {
  [key in keyof GeneratedShop]?: boolean;
};

type SettlementWealth = "Village" | "Town" | "City";

// --- Default Data - Expanded and Refined ---
const defaultShopGenData: ShopGenData = {
  shopTypes: [
    "General Wares", "Adventuring Supplies", "Smithy", "Armourer", "Alchemist / Apothecary",
    "Herbalist", "Jeweller", "Tailor / Weaver", "Leatherworker", "Fletcher / Bowyer",
    "Scribe / Cartographer", "Bookstore", "Pawnshop", "Magic Items (Uncommon)", "Potions"
  ],
  wealthLevels: ["Village", "Town", "City"], // Added
  namePrefix: {
    "General Wares": ["The Honest", "The Lucky", "The Humble", "The Village", "The Wayfarer's", "The Everything", "Goods &"],
    "Adventuring Supplies": ["The Bold", "The Iron", "The Pathfinder's", "The Survivor's", "The Ready", "The Deep", "Trail"],
    "Smithy": ["The Gilded", "The Hammer &", "The Singing", "The Broken", "The Master's", "Iron", "Steel"],
    "Armourer": ["The Shining", "The Steadfast", "The Guardian's", "Plate &", "Shield &", "The Iron"],
    "Alchemist / Apothecary": ["The Bubbling", "The Glimmering", "The Arcane", "The Alchemist's", "The Fading", "The Wise", "Mortar &"],
    "Herbalist": ["The Verdant", "Root &", "The Forest", "The Quiet", "Willow", "Sage"],
    "Jeweller": ["The Golden", "The Silver", "Star", "Gem", "The Dragon's", "The Exquisite"],
    "Tailor / Weaver": ["The Golden", "Silk &", "The Nimble", "Thread &", "The Master's", "The Loom"],
    "Leatherworker": ["Hide &", "The Supple", "The Tough", "Stitch &", "The Master's", "The Boar's"],
    "Fletcher / Bowyer": ["The True", "The Keen", "Arrow &", "The Yew", "Feather &", "The Swift"],
    "Scribe / Cartographer": ["The Golden", "The Careful", "Quill &", "The Accurate", "Scroll &", "The World"],
    "Bookstore": ["The Dusty", "The Wise", "Tome &", "The Owl's", "Forgotten", "The Paper"],
    "Pawnshop": ["The Second", "The Lucky", "Honest", "The Magpie's", "Old", "The Forgotten"],
    "Magic Items (Uncommon)": ["The Curious", "The Glimmering", "The Hidden", "The Collector's", "The Wanderer's", "Arcane"],
    "Potions": ["The Bubbling", "The Healing", "The Crimson", "The Azure", "Vial &", "The Alchemist's"],
    "Default": ["The Reliable", "The Local", "The Proper", "The Master's", "Fine"]
  },
  nameSuffix: {
    "General Wares": ["Pantry", "Goods", "Wagon", "Corner", "Post", "Emporium", "Sundries"],
    "Adventuring Supplies": ["Pack", "Outfitter", "Cache", "Post", "Gear", "Depot", "Trailhead"],
    "Smithy": ["Tongs", "Anvil", "Steel", "Forge", "Blade", "Hammer", "Bellows"],
    "Armourer": ["Mail", "Plate", "Shield", "Guard", "Bulwark", "Helm"],
    "Alchemist / Apothecary": ["Vial", "Cauldron", "Tome", "Eye", "Mortar", "Remedy", "Draught"],
    "Herbalist": ["Leaf", "Branch", "Root", "Petal", "Seed", "Grove"],
    "Jeweller": ["Stone", "Facet", "Hoard", "Treasures", "Setting", "Gem"],
    "Tailor / Weaver": ["Needle", "Shears", "Loom", "Thread", "Stitch", "Garment"],
    "Leatherworker": ["Hide", "Strap", "Tannery", "Hide", "Boot", "Glove"],
    "Fletcher / Bowyer": ["Flight", "Shaft", "String", "Nock", "Bow", "Target"],
    "Scribe / Cartographer": ["Quill", "Inkwell", "Chart", "Compass", "Parchment", "Map"],
    "Bookstore": ["Tome", "Scroll", "Page", "Word", "Quill", "Shelf"],
    "Pawnshop": ["Chance", "Finds", "Treasures", "Exchange", "Loan", "Pawn"],
    "Magic Items (Uncommon)": ["Curiosity", "Relic", "Wonders", "Arcanum", "Oddity", "Bauble"],
    "Potions": ["Flask", "Phial", "Brew", "Tincture", "Elixir", "Draught"],
    "Default": ["Goods", "Wares", "Shop", "Stall", "Trading"]
  },
  proprietor: [
    "A harried-looking gnome with ink/potion/soot-stained fingers", "A retired, one-eyed soldier with a booming voice and missing limb",
    "A cheerful halfling family, all talking over each other", "A mysterious, robed figure who speaks only in whispers or riddles",
    "A shrewd merchant who haggles aggressively over every copper piece", "An elderly widow/widower, surprisingly strong and sharp-witted",
    "A flamboyant former performer (bard/actor) who gestures wildly", "A stoic dwarf who communicates mostly through grunts",
    "An absent-minded academic (sage/wizard) often lost in thought", "A nervous individual who constantly glances over their shoulder",
    "An overly friendly person who might be hiding something", "A pair of identical twins who finish each other's sentences"
  ],
  aesthetic: [
    "Cluttered and dusty, items piled high, narrow aisles", "Immaculately clean and organised, smells sterile or strongly of one scent (sulphur, polish)",
    "Bare shelves, most goods are 'in the back' or require asking", "Dimly lit, smells of strange herbs, incense, or ozone",
    "Loud and chaotic (anvil ringing, potions bubbling, arguments)", "Looks abandoned or condemned, but the proprietor appears suddenly",
    "Brightly lit, perhaps magically, with polished surfaces", "Cosy and welcoming, smells of woodsmoke, tea, or baked goods",
    "Filled with exotic plants, stuffed animals, or strange artefacts", "Decorated with religious symbols or grim warnings",
    "Unnervingly silent, dust motes dancing in lone shafts of light", "Has a small, aggressive pet (cat, pseudodragon, small construct)"
  ],
  // NEW Field: stockLevel
  stockLevel: {
    "General Wares": {
      "Village": ["Basic supplies only: flour, nails, cheap ale, candles.", "Limited goods, mostly local produce and simple tools.", "Often out of stock of anything unusual."],
      "Town": ["A good selection of mundane items, tools, and foodstuffs.", "Carries goods from nearby towns.", "Has most items from the PHB Adventuring Gear list under 15 gp."],
      "City": ["Vast inventory of goods from across the realm.", "Carries luxury items, fine clothes, and exotic spices.", "Can order almost any mundane item if you're willing to wait."]
    },
    "Adventuring Supplies": {
      "Village": ["A few coils of rope, some torches, and maybe a waterskin.", "Sells leftover gear from prospectors.", "Only has what a local farmer might need."],
      "Town": ["Good stock of core gear: backpacks, rope, rations, basic weapons.", "Has a climbing kit or two.", "Carries most items from the PHB Adventuring Gear list under 25 gp."],
      "City": ["Fully stocked with all standard adventuring gear.", "Sells specialised kits (climber's, poisoner's).", "Has mounts, barding, and vehicles available for order."]
    },
    "Smithy": {
      "Village": ["Mostly mends farm equipment and tools. Has a few simple weapons.", "Can repair armour but has none for sale.", "Sells nails, horseshoes, and crowbars."],
      "Town": ["A good stock of standard weapons (swords, axes) and mail armour.", "Can forge most simple and martial weapons given time.", "Has one or two suits of heavier armour."],
      "City": ["Full selection of all non-magical weapons and armour.", "Masterwork items available at a high price.", "Can forge items from rare materials if provided."]
    },
    "Armourer": {
      "Village": ["Primarily repairs leather and padded armour.", "Has a few old shields for sale.", "Can fix chain mail, but doesn't sell it."],
      "Town": ["Sells leather, studded leather, and all forms of mail.", "Has one or two suits of plate armour.", "Can craft most armour types on commission."],
      "City": ["Full selection of all armour types, including exotic pieces.", "Sells masterwork plate.", "Offers custom fittings and decorative finishes."]
    },
    "Alchemist / Apothecary": {
      "Village": ["Sells basic herbal remedies, poultices, and antitoxins.", "Might have one or two Potions of Healing.", "No true alchemical goods."],
      "Town": ["Good stock of Antitoxins, Alchemist's Fire, and Acid.", "Reliably carries Potions of Healing.", "May have one or two other Common potions."],
      "City": ["Carries a wide range of alchemical items.", "Sells Common and some Uncommon potions.", "Can identify unknown potions for a fee."]
    },
    "Herbalist": {
      "Village": ["Sells common herbs,antitoxins, and poultices.", "Has a limited stock based on the local season.", "Can identify common local plants."],
      "Town": ["Good stock of mundane herbs and ingredients.", "Sells Healer's Kits.", "May have rare local herbs or basic poisons."],
      "City": ["Carries a vast array of herbs from across the world.", "Sells rare and exotic ingredients.", "Can brew custom herbal remedies or basic poisons."]
    },
    "Jeweller": {
      "Village": ["Proprietor is a simple artisan making copper/silver trinkets.", "No gemstones for sale.", "Buys gems but pays poorly."],
      "Town": ["Sells silver and gold jewellery, some with common gems.", "Has a selection of 50 gp gemstones.", "Can mount gems and do fine repairs."],
      "City": ["Sells exquisite jewellery of gold and platinum.", "Carries a wide variety of 100 gp and 500 gp gemstones.", "May have one or two 1,000 gp+ gems."]
    },
    "Tailor / Weaver": {
      "Village": ["Mends clothes and weaves simple wool/cotton cloth.", "Sells Traveler's Clothes.", "Can make simple cloaks."],
      "Town": ["Sells a variety of clothing, including Costumes and Fine Clothes.", "Works with linen and some silk.", "Can craft banners or guild emblems."],
      "City": ["High-fashion boutique. Sells exquisite Fine Clothes.", "Works with exotic silks, shadow-weave, etc.", "Can craft items with hidden pockets or custom fittings."]
    },
    "Leatherworker": {
      "Village": ["Repairs boots, saddles, and leather armour.", "Sells basic leather goods like pouches and belts.", "Has one or two suits of Leather Armour."],
      "Town": ["Sells Leather and Studded Leather armour.", "Crafts high-quality saddles and barding.", "Sells boots, gloves, and backpacks."],
      "City": ["Sells all types of leather armour, including exotic hides.", "Can craft masterwork leather goods.", "Offers custom tooling and designs."]
    },
    "Fletcher / Bowyer": {
      "Village": ["Sells simple Shortbows and arrows.", "Repairs bows.", "Stock is limited and functional."],
      "Town": ["Sells Shortbows, Longbows, and Light Crossbows.", "Carries a good stock of arrows and bolts.", "May have one Heavy Crossbow."],
      "City": ["Sells all common bow and crossbow types.", "Carries masterwork ammunition.", "Can craft custom bows from exotic woods."]
    },
    "Scribe / Cartographer": {
      "Village": ["No dedicated shop. The local priest or elder might write letters for a fee.", "Might have a single, old map of the local area.", "Sells a few sheets of parchment and one pot of ink."],
      "Town": ["Sells parchment, ink, quills, and sealing wax.", "Has maps of the local region and major trade routes.", "Offers services for copying non-magical text."],
      "City": ["Sells high-quality writing supplies.", "Has a large atlas of maps, including some rare or old charts.", "Offers copying, forgery, and bookbinding services."]
    },
    "Bookstore": {
      "Village": ["No bookstore. A local wise-person might have a small, personal collection of 2-3 books.", "Sells single sheets of parchment.", "Might have one or two almanacs or chapbooks."],
      "Town": ["A small, dusty shop with a few dozen books.", "Carries common histories, religious texts, and some fiction.", "Can order books from the city."],
      "City": ["A large library and shop with hundreds or thousands of books.", "Carries books on arcane lore, planar travel, and rare histories.", "May have a restricted section."]
    },
    "Pawnshop": {
      "Village": ["No pawnshop. A general store might offer poor trade-in values.", "Locals trade amongst themselves.", "A travelling pedlar might pass through."],
      "Town": ["A cluttered shop with a random assortment of mundane goods.", "Might have a few art objects or cheap gems.", "A good place to sell low-value adventuring finds."],
      "City": ["A well-stocked shop with a bizarre inventory.", "Often has art objects, jewellery, and sometimes minor magic items.", "A good place to find oddities or sell valuable, non-magical items quickly."]
    },
    "Magic Items (Uncommon)": {
      "Village": ["Doesn't exist.", "A local hedge wizard might have a single Common item to sell.", "A 'magic' shop sells fake charms and trinkets."],
      "Town": ["A secretive shop, possibly hidden.", "Has 1d4 Common magic items.", "Has a 50% chance of having 1d4-1 Uncommon magic items."],
      "City": ["A well-known (if expensive) establishment.", "Carries a selection of Common and Uncommon magic items.", "Can identify items. May be able to broker sales of Rare items."]
    },
    "Potions": {
      "Village": ["The local herbalist sells Antitoxin and has 1d4 Potions of Healing.", "No dedicated shop.", "A local priest may provide healing services instead."],
      "Town": ["A dedicated alchemist or temple shop.", "Always has Potions of Healing.", "Sells 1d4 other Common potions (e.g., Climbing, Animal Friendship)."],
      "City": ["A well-stocked apothecary.", "Carries all Common potions.", "Has a selection of 1d4 Uncommon potions (e.g., Growth, Resistance)."]
    },
    "Default": { // Fallback for user-added types
      "Village": ["Basic, locally-made items only. Limited stock.", "Mostly offers repair services.", "Stock is poor and overpriced."],
      "Town": ["A decent selection of standard items.", "Can handle most common requests.", "Stock is functional and fairly priced."],
      "City": ["A huge variety of items, including luxury and exotic versions.", "Masterwork quality is available.", "Can commission nearly anything."]
    }
  },
  notableItem: { // These remain as flavour hooks, independent of stock level
    "General Wares": [
      "A 'talking' fish mounted on a plaque (repeats overheard phrases)", "A music box that plays a haunting tune only certain people can hear",
      "Exotic spices from a faraway land that have minor magical effects", "A suspiciously well-made, possibly sentient, wooden spoon",
      "A set of nesting dolls (one is missing)", "A self-folding blanket", "A perpetually sharp knife that dulls magic items"
    ],
    "Adventuring Supplies": [
      "A map that seems to update itself with recent changes", "A compass that points towards the owner's greatest desire (or fear)",
      "A 50-foot coil of rope that cannot be cut by non-magical means", "Boots that magically clean themselves",
      "A waterskin that slowly refills with brackish water", "A tinderbox that only works for lawful good characters", "A grappling hook that occasionally bites the user"
    ],
    "Smithy": [
      "A 'slightly' cursed dagger that whispers temptations (minor flaw)", "A heavy shield bearing the crest of a disgraced or lost noble house",
      "A set of masterwork smith's tools, clearly stolen", "An ornate, ceremonial sword far too heavy for practical use",
      "A helmet that grants Advantage on saves vs. deafness", "Horseshoes that allow silent movement", "Adamantine crowbar"
    ],
    "Armourer": [
      "A suit of gleaming plate armour rumoured to be haunted", "A shield that occasionally reflects spells (1/day)",
      "Elven chain mail, intricately woven", "A helm shaped like a roaring beast's head",
      "Spiked armour recovered from a defeated foe", "Ceremonial armour of a foreign guard", "A helmet with built-in darkvision (5 ft.)"
    ],
    "Alchemist / Apothecary": [
      "A potion that glows faintly (effect is beneficial but random, e.g., Potion of Climbing)", "A bottle of potent 'Dragon's Breath' liquor (grants temporary fire resistance)",
      "A seemingly blank book that reveals alchemical formulae when specific ingredients are smeared on it", "A crystal that hums softly and purifies liquids (1/day)",
      "An unstable concoction labelled 'DO NOT SHAKE' (minor explosion)", "A vial of Universal Solvent (or what they claim is universal solvent)", "A set of miniature, animated homunculi assistants"
    ],
    "Herbalist": [
      "Rare moonpetal flowers that bloom only under moonlight", "A bundle of herbs that repel spirits",
      "Seeds for a plant that grows aggressively fast", "A salve that allows temporary communication with plants",
      "Poisonous roots disguised as common vegetables", "A living, potted plant that whispers secrets", "Powdered mummy dust (authenticity questionable)"
    ],
    "Jeweller": [
      "A ring with a hidden poison compartment", "An amulet that warms in the presence of gold",
      "A gemstone that occasionally shows glimpses of the past", "A necklace made from monster teeth (various sizes)",
      "A crown fit for a minor noble (perhaps stolen)", "A set of tools for detecting fake gemstones", "A cursed locket that attracts bad luck (minor flaw)"
    ],
    "Tailor / Weaver": [
      "A cloak woven with shimmering, colour-changing thread", "Gloves that allow the wearer to handle hot objects safely",
      "A tapestry depicting a forgotten (or prophetic) historical event", "Boots lined with fur that grant resistance to cold",
      "A hat that occasionally whispers compliments or insults", "Self-mending trousers (repairs 1/day)", "A bolt of shadow-spun silk (grants advantage on stealth in dim light)"
    ],
    "Leatherworker": [
      "A wineskin that magically chills its contents", "A sturdy backpack with hidden, magically expanded pockets (like a mini Bag of Holding)",
      "Gloves made from displacer beast hide (blur effect 1/day)", "Armour with intricate, possibly magical, tooling",
      "A whip crafted from a demon's tail (minor fear effect)", "Boots that leave no tracks in natural earth", "A saddle rumoured to calm any non-monstrous mount"
    ],
    "Fletcher / Bowyer": [
      "Arrows fletched with griffon feathers (10% extra range)", "A bow carved from a sentient tree (it groans when drawn)",
      "Bolts designed to shatter on impact (minor area effect, 1d4 piercing)", "An arrow that returns to the quiver once (and only once)",
      "A quiver that holds twice its apparent capacity", "A beautifully crafted but badly warped longbow (cursed)", "A crossbow with an unusually fast, built-in loading mechanism"
    ],
    "Scribe / Cartographer": [
      "Ink that glows faintly in the dark (or only in moonlight)", "A map depicting a place (island, street) that doesn't seem to exist",
      "Quills made from phoenix feathers (fire resistant paper needed)", "A set of magical chalk that can draw temporary, illusory walls (1/day)",
      "Parchment that erases itself after 24 hours (for secret messages)", "A translating dictionary for a rare or dead language",
      "A detailed anatomical drawing of a rare monster, noting weaknesses"
    ],
    "Bookstore": [
      "A book bound in monster hide that snaps at readers", "A novel that seems to tell the story of the reader's future (vaguely)",
      "A collection of prophecies, most already proven false... but one rings true", "A first-edition history book with controversial, handwritten annotations",
      "A cookbook containing dangerous or magical recipes (e.g., 'How to Cook for Ghouls')", "A locked diary hinting at a local scandal or treasure",
      "A pop-up book depicting planar landscapes that seem to move"
    ],
    "Pawnshop": [
      "A broken holy symbol of a forgotten god (still has minor power)", "A musical instrument that plays by itself at inconvenient times",
      "A single, masterfully crafted adamantine boot", "A chipped crystal ball that shows distorted, possibly false, images",
      "A dragon's tooth, claimed to be from a famous local wyrm", "A tarnished silver mirror that doesn't show reflections (only the 'true' self)",
      "A petrified creature of unknown origin (small, fits on a shelf)"
    ],
    "Magic Items (Uncommon)": [
      "A Bag of Holding being used as a waste bin (smells terrible)", "An Immovable Rod holding up a collapsing shelf of junk",
      "A Driftglobe mistaken for a fancy, non-functional paperweight", "A Cloak of Elvenkind dyed garish, clashing colours",
      "A Hat of Disguise stuck in one comical, unflattering form", "A Pearl of Power kept in a grimy fishbowl",
      "A Wand of Secrets used as a back-scratcher by the proprietor"
    ],
    "Potions": [
        "A Potion of Healing that tastes revolting (e.g., 'Troll's Blood Brew') but works",
        "An unlabeled vial containing swirling, multicolored liquid (random minor effect)",
        "A Potion of Growth, slightly unstable, might have cosmetic side effects (e.g., blue skin)",
        "A Philter of Love, commissioned by a local noble but never collected",
        "A Potion of Poison disguised as a health tonic, 'for a rival'",
        "Expired potions sold at a steep discount (50% chance to fail or have weird effect)",
        "A 'DIY' potion kit with volatile, mismatched ingredients"
    ],
    "Default": [
        "A surprisingly well-crafted mundane item (e.g., a perfectly balanced hammer)", "An item clearly stolen from a nearby noble (has crest)",
        "A puzzle box that no one in the shop can open", "A foreign coin of unknown value or metal",
        "A tool specific to a rare or forgotten craft", "A map fragment leading nowhere obvious"
    ]
  },
  conflict: [
    "The proprietor is desperately seeking rare ingredients/materials for a special order",
    "A rival shop owner is using sabotage/intimidation to drive them out of business",
    "The local thieves' guild is demanding exorbitant protection money",
    "The shop is a front for a secret organisation (spies, cultists, rebels)",
    "A recently sold high-value item turned out to be fake/cursed, and the buyer is furious",
    "The proprietor is in deep debt to a dangerous moneylender or criminal element",
    "Guard/Watch suspect the shop deals in stolen or illegal goods",
    "A vital supplier has disappeared or been cut off",
    "The shop is built over something significant (ruin, tomb, portal) attracting attention",
    "The proprietor's family member has been kidnapped to force their services"
  ]
};

export default function ShopGeneratorPage() {
  const [shopData, setShopData] = useState<ShopGenData>(defaultShopGenData);
  const [generatedShop, setGeneratedShop] = useState<GeneratedShop | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedType, setSelectedType] = useState('General Wares');
  const [selectedWealth, setSelectedWealth] = useState<SettlementWealth>('Town'); // Added
  const [lockedComponents, setLockedComponents] = useState<LockedComponents>({});

  // Options
  const [generateName, setGenerateName] = useState(true);
  const [generateType, setGenerateType] = useState(true);
  const [generateProprietor, setGenerateProprietor] = useState(true);
  const [generateAesthetic, setGenerateAesthetic] = useState(true);
  const [generateStockLevel, setGenerateStockLevel] = useState(true); // Added
  const [generateNotableItem, setGenerateNotableItem] = useState(true);
  const [generateConflict, setGenerateConflict] = useState(true);

   // Load saved data
   useEffect(() => {
    const saved = localStorage.getItem('worldBuilderShopData_v2'); // Use v2 key
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check for new 'stockLevel' object
        if (Array.isArray(parsed.shopTypes) && typeof parsed.namePrefix === 'object' && Array.isArray(parsed.proprietor) && typeof parsed.notableItem === 'object' && typeof parsed.stockLevel === 'object') {
          setShopData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
          if (!parsed.shopTypes.includes(selectedType)) {
             setSelectedType(parsed.shopTypes[0] || 'General Wares');
          }
          // Ensure wealthLevels exists, if not, add from default
          if (!parsed.wealthLevels) {
            setShopData(prev => ({...prev, wealthLevels: defaultShopGenData.wealthLevels}));
          }
        } else {
            console.warn('Saved Shop data structure mismatch (v2), resetting.');
            resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Shop data (v2):', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultShopGenData, null, 2));
      if(defaultShopGenData.shopTypes && defaultShopGenData.shopTypes.length > 0){
          setSelectedType(defaultShopGenData.shopTypes[0]);
      }
    }
  }, []); // Empty dependency array

  const resetToDefaultData = () => {
    setShopData(defaultShopGenData);
    setJsonInput(JSON.stringify(defaultShopGenData, null, 2));
    localStorage.removeItem('worldBuilderShopData_v2'); // Use v2 key
  };

  const getRandom = <T extends string | number | Record<string, any>>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateSingleComponent = (componentKey: keyof GeneratedShop): GeneratedShop[keyof GeneratedShop] => {
      // Helper to get type-specific or fallback array
      const getTypeSpecificArray = (
          dataObject: ShopNameParts | ShopNotableItems | undefined,
          fallbackKey: keyof (ShopNameParts | ShopNotableItems) = "Default"
      ): string[] => {
          if (!dataObject) return [];
          const specificArray = dataObject[selectedType];
          if (specificArray && Array.isArray(specificArray) && specificArray.length > 0) return specificArray;
          
          const fallback = dataObject[fallbackKey as string];
          if (fallback && Array.isArray(fallback) && fallback.length > 0) return fallback;
          
           const defaultFallback = dataObject["Default"];
           if(defaultFallback && Array.isArray(defaultFallback)) return defaultFallback;

           return [];
      };

      // Helper for stock level
       const getStockLevelArray = (): string[] => {
          const stockData = shopData.stockLevel;
          if (!stockData) return [];

          const typeStock = stockData[selectedType];
          if (typeStock && typeStock[selectedWealth] && Array.isArray(typeStock[selectedWealth]) && typeStock[selectedWealth].length > 0) {
              return typeStock[selectedWealth];
          }
          
          // Fallback to "Default" shop type for the selected wealth
          const defaultTypeStock = stockData["Default"];
          if (defaultTypeStock && defaultTypeStock[selectedWealth] && Array.isArray(defaultTypeStock[selectedWealth]) && defaultTypeStock[selectedWealth].length > 0) {
              return defaultTypeStock[selectedWealth];
          }

          // Ultimate fallback to "Default" shop, "Town" wealth
          if (defaultTypeStock && defaultTypeStock["Town"] && Array.isArray(defaultTypeStock["Town"])) {
              return defaultTypeStock["Town"];
          }
          
          return [];
       };

      switch(componentKey) {
          case 'name':
              const prefixes = getTypeSpecificArray(shopData.namePrefix, "General Wares");
              const suffixes = getTypeSpecificArray(shopData.nameSuffix, "General Wares");
              const prefix = getRandom(prefixes);
              const suffix = getRandom(suffixes);
              return (prefix && suffix) ? `${prefix} ${suffix}` : "Unnamed Shop";
          case 'type': return selectedType;
          case 'wealth': return selectedWealth; // Added
          case 'proprietor': return getRandom(shopData.proprietor) || "An unremarkable person";
          case 'aesthetic': return getRandom(shopData.aesthetic) || "Plain and functional";
          case 'stockLevel': // Added
              const stockOptions = getStockLevelArray();
              return getRandom(stockOptions) || "Standard stock for a place like this.";
          case 'notableItem':
              const items = getTypeSpecificArray(shopData.notableItem, "General Wares");
              return getRandom(items) || "Nothing special for sale";
          case 'conflict': return getRandom(shopData.conflict) || "Business as usual";
          default: return "N/A";
      }
  }

  const generateShop = (fullReroll: boolean = true) => {
    const shop: Partial<GeneratedShop> = {};

     const fieldsToGenerate: (keyof GeneratedShop)[] = [
      ...(generateName ? (['name'] as (keyof GeneratedShop)[]) : []),
      ...(generateType ? (['type', 'wealth'] as (keyof GeneratedShop)[]) : []), // Link wealth to type
      ...(generateProprietor ? (['proprietor'] as (keyof GeneratedShop)[]) : []),
      ...(generateAesthetic ? (['aesthetic'] as (keyof GeneratedShop)[]) : []),
      ...(generateStockLevel ? (['stockLevel'] as (keyof GeneratedShop)[]) : []), // Added
      ...(generateNotableItem ? (['notableItem'] as (keyof GeneratedShop)[]) : []),
      ...(generateConflict ? (['conflict'] as (keyof GeneratedShop)[]) : []),
    ];

    fieldsToGenerate.forEach(key => {
        if (fullReroll || !lockedComponents[key]) {
             shop[key] = generateSingleComponent(key) as any;
     } else if (generatedShop && generatedShop[key] !== undefined) {
       shop[key] = generatedShop[key] as any;
        } else {
             // Handle case where it was locked but no prev state
             shop[key] = generateSingleComponent(key) as any;
        }
    });

     const finalShop: GeneratedShop = {
      name: shop.name ?? generateSingleComponent('name') as string,
      type: shop.type ?? generateSingleComponent('type') as string,
      wealth: shop.wealth ?? generateSingleComponent('wealth') as SettlementWealth, // Added
      proprietor: shop.proprietor ?? generateSingleComponent('proprietor') as string,
      aesthetic: shop.aesthetic ?? generateSingleComponent('aesthetic') as string,
      stockLevel: shop.stockLevel ?? generateSingleComponent('stockLevel') as string, // Added
      notableItem: shop.notableItem ?? generateSingleComponent('notableItem') as string,
      conflict: shop.conflict ?? generateSingleComponent('conflict') as string,
    };

    if(isCompleteShop(finalShop)){
        setGeneratedShop(finalShop);
    } else {
        console.error("Generated Shop is missing fields:", finalShop);
        generateShop(true); // Fallback retry
    }
  };

   const rerollComponent = (componentKey: keyof GeneratedShop) => {
      if (!generatedShop) return;
      const newValue = generateSingleComponent(componentKey);
      setGeneratedShop(prev => {
          if (!prev) return null;
          const newState = { ...prev };
          (newState[componentKey] as any) = newValue;
          
          // If 'type' is rerolled, 'name' and 'stockLevel' and 'notableItem' might need rerolling if unlocked
          if(componentKey === 'type') {
              if(!newState.name || !lockedComponents['name']) newState.name = generateSingleComponent('name') as string;
              if(!newState.stockLevel || !lockedComponents['stockLevel']) newState.stockLevel = generateSingleComponent('stockLevel') as string;
              if(!newState.notableItem || !lockedComponents['notableItem']) newState.notableItem = generateSingleComponent('notableItem') as string;
          }
           // If 'wealth' is rerolled, 'stockLevel' might need rerolling if unlocked
          if(componentKey === 'wealth') {
               if(!newState.stockLevel || !lockedComponents['stockLevel']) newState.stockLevel = generateSingleComponent('stockLevel') as string;
          }

          if (isCompleteShop(newState)) {
               return newState;
          }
          console.error(`Rerolling ${componentKey} resulted in incomplete state`);
          return prev;
      });
  };

  const toggleLock = (componentKey: keyof GeneratedShop) => {
    setLockedComponents(prev => ({
      ...prev,
      [componentKey]: !prev[componentKey]
    }));
  };

 const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Added check for new fields
      if (Array.isArray(parsed.shopTypes) && Array.isArray(parsed.wealthLevels) && typeof parsed.namePrefix === 'object' && typeof parsed.notableItem === 'object' && typeof parsed.stockLevel === 'object') {
        setShopData(parsed);
        localStorage.setItem('worldBuilderShopData_v2', jsonInput); // Use v2 key
        setSaveStatus('✓ Data saved successfully!');
          if (!parsed.shopTypes.includes(selectedType)) {
             setSelectedType(parsed.shopTypes[0] || 'General Wares');
          }
           if (!parsed.wealthLevels.includes(selectedWealth)) {
             setSelectedWealth(parsed.wealthLevels[0] || 'Town');
          }
      } else {
          throw new Error("Invalid data structure: Missing required keys/arrays/objects.");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Save Error:", e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const resetData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
      resetToDefaultData();
      setLockedComponents({});
      setSaveStatus('↻ Reset to defaults');
       if(defaultShopGenData.shopTypes && defaultShopGenData.shopTypes.length > 0){
           setSelectedType(defaultShopGenData.shopTypes[0]);
       }
       setSelectedWealth('Town'); // Reset wealth to default
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyShop = () => {
    if (!generatedShop) return;

    let text = '';
    if (generateName && generatedShop.name) text += `${generatedShop.name}\n`;
    if (generateType && generatedShop.type) text += `${generatedShop.type} (${generatedShop.wealth})\n\n`;
    if (generateProprietor && generatedShop.proprietor) text += `Proprietor: ${generatedShop.proprietor}\n`;
    if (generateAesthetic && generatedShop.aesthetic) text += `Aesthetic: ${generatedShop.aesthetic}\n`;
    if (generateStockLevel && generatedShop.stockLevel) text += `Stock: ${generatedShop.stockLevel}\n`; // Added
    if (generateNotableItem && generatedShop.notableItem) text += `Notable Item: ${generatedShop.notableItem}\n`;
    if (generateConflict && generatedShop.conflict) text += `\nConflict / Hook: ${generatedShop.conflict}\n`;

    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // --- ComponentWithControls Helper ---
  const ComponentWithControls = ({
    label,
    content,
    componentKey,
    italic = false
  }: {
    label?: string;
    content: string;
    componentKey: keyof GeneratedShop;
    italic?: boolean;
  }) => {
     const includeMap: Record<keyof GeneratedShop, boolean> = {
        name: generateName,
        type: generateType,
        wealth: generateType, // Link wealth visibility to type visibility
        proprietor: generateProprietor,
        aesthetic: generateAesthetic,
        stockLevel: generateStockLevel, // Added
        notableItem: generateNotableItem,
        conflict: generateConflict,
    };

    if (!includeMap[componentKey] || !content || content === "N/A") {
        return null;
    }

    const contentClass = italic ? "italic text-moss-300" : "text-moss-200";

    return (
       <div className={`relative group mb-3 pr-20 text-lg ${contentClass}`}>
        {label && <strong className="text-moss-100 not-italic">{label}:</strong>}{' '}
        {content}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleLock(componentKey)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
              lockedComponents[componentKey]
                ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
            } border `}
            title={lockedComponents[componentKey] ? 'Unlock' : 'Lock'}
          >
            {lockedComponents[componentKey] ? '🔒' : '🔓'}
          </button>
          <button
            onClick={() => rerollComponent(componentKey)}
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
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-moss-950 to-gray-900 text-moss-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Shop Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create distinctive shops with unique wares and story hooks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
             <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100 border-b border-moss-700 pb-2">
                Generator Options
              </h2>

              {/* Shop Type Selector */}
              <div className="mb-4"> {/* Reduced margin */}
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="shopTypeSelect">
                  Shop Type
                </label>
                <select
                  id="shopTypeSelect"
                  value={selectedType}
                  onChange={(e) => {
                      setSelectedType(e.target.value);
                      // Reset locks dependent on type
                      setLockedComponents(prev => ({ ...prev, name: false, notableItem: false, stockLevel: false }));
                  }}
                   className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  {shopData.shopTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* NEW: Settlement Wealth Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="wealthLevelSelect">
                  Settlement Wealth / Location
                </label>
                <select
                  id="wealthLevelSelect"
                  value={selectedWealth}
                  onChange={(e) => {
                      setSelectedWealth(e.target.value as SettlementWealth);
                       // Reset lock dependent on wealth
                      setLockedComponents(prev => ({ ...prev, stockLevel: false }));
                  }}
                   className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  {(shopData.wealthLevels || defaultShopGenData.wealthLevels).map(level => ( // Fallback for robustness
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Field Toggles */}
              <h3 className="text-base font-medium text-moss-200 mb-2">Include in Generation:</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateName} onChange={(e) => setGenerateName(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Name</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateType} onChange={(e) => setGenerateType(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Type & Wealth</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateAesthetic} onChange={(e) => setGenerateAesthetic(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Aesthetic</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateProprietor} onChange={(e) => setGenerateProprietor(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Proprietor</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateStockLevel} onChange={(e) => setGenerateStockLevel(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Stock Level</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input type="checkbox" checked={generateNotableItem} onChange={(e) => setGenerateNotableItem(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Notable Item</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors col-span-2">
                  <input type="checkbox" checked={generateConflict} onChange={(e) => setGenerateConflict(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                  <span>Conflict / Hook</span>
                 </label>
              </div>

              <button
                onClick={() => generateShop(false)}
                 className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              >
                {generatedShop ? 'Generate / Reroll Unlocked' : 'Generate Shop'}
              </button>
            </div>

            {/* Generated Shop Display */}
            {generatedShop && isCompleteShop(generatedShop) && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                 {/* Name and Type/Wealth */}
                  <ComponentWithControls
                     content={generatedShop.name}
                     componentKey="name"
                 />
                 <ComponentWithControls
                     content={`${generatedShop.type} (${generatedShop.wealth})`}
                     componentKey="type" // This will lock/reroll both type and wealth
                     italic={true}
                 />
                <hr className="border-moss-600 my-4"/>

                 {/* Details */}
                 <ComponentWithControls
                     label="Proprietor"
                     content={generatedShop.proprietor}
                     componentKey="proprietor"
                 />
                 <ComponentWithControls
                     label="Aesthetic"
                     content={generatedShop.aesthetic}
                     componentKey="aesthetic"
                 />
                 {/* Stock Level added */}
                 <ComponentWithControls
                     label="Stock"
                     content={generatedShop.stockLevel}
                     componentKey="stockLevel"
                 />
                 <ComponentWithControls
                     label="Notable Item"
                     content={generatedShop.notableItem}
                     componentKey="notableItem"
                 />
                 <hr className="border-moss-600 my-4"/>

                 {/* Conflict */}
                 <ComponentWithControls
                     label="Conflict / Hook"
                     content={generatedShop.conflict}
                     componentKey="conflict"
                 />

                <button
                  onClick={copyShop}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedShop && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select your options and click "Generate Shop" to begin</p>
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
                    Edit the JSON below to customise shop types, names, proprietors, stock levels, and more.
                    Ensure the structure matches the required format. Your changes are saved locally to your browser.
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
                      onClick={resetData}
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
                    <li><strong className="text-moss-100">Shop Types:</strong> Categories (Smithy, Apothecary, etc.)</li>
                    <li><strong className="text-moss-100">Wealth Levels:</strong> Location types (Village, Town, City)</li>
                    <li><strong className="text-moss-100">Name Parts:</strong> Prefixes/Suffixes, type-specific</li>
                    <li><strong className="text-moss-100">Proprietors:</strong> Shop owners & personalities</li>
                    <li><strong className="text-moss-100">Aesthetics:</strong> Sensory & atmospheric details</li>
                    <li><strong className="text-moss-100">Stock Level:</strong> Inventory descriptions (by Type & Wealth)</li>
                    <li><strong className="text-moss-100">Notable Items:</strong> Unique wares, type-specific</li>
                    <li><strong className="text-moss-100">Conflicts:</strong> Story hooks & complications</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Shops
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li><strong className="text-moss-100">Lock (🔒):</strong> Preserve fields when regenerating others.</li>
                  <li><strong className="text-moss-100">Reroll (↻):</strong> Change just one specific detail.</li>
                  <li>Use "Stock Level" to set player expectations for what's available to buy.</li>
                  <li>"Notable Items" can become quest hooks, rewards, or red herrings.</li>
                  <li>"Conflicts" add depth and potential recurring plot points.</li>
                  <li>Customise `stockLevel` data in the editor to match your world's economy.</li>
                  <li>Copy shops to your world notes for quick reference during play.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
