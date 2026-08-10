import { WasteCategory } from '../types';

export interface RecyclingStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface WasteTypeInfo {
  id: string;
  name: string;
  category: WasteCategory;
  badgeColor: string;
  binType: string;
  binColorHex: string;
  recyclabilityRating: string;
  commonItems: string[];
  recyclingProcess: RecyclingStep[];
  preparationTips: string[];
  environmentalBenefit: string;
  sampleQuery: string;
}

export const WASTE_TYPES: WasteTypeInfo[] = [
  {
    id: 'plastic',
    name: 'Plastic Packaging & PET Bottles',
    category: 'Plastic',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    binType: 'Blue / Yellow Recyclables Bin',
    binColorHex: '#2563eb',
    recyclabilityRating: 'High (#1 PET, #2 HDPE, #5 PP)',
    commonItems: ['Clear PET water bottles', 'HDPE milk jugs', 'Detergent containers', 'Yogurt & food tubs'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Collection & Baling',
        description: 'Recyclables are gathered, compacted into large dense bales at Materials Recovery Facilities (MRFs), and transported to plastic reclaimers.',
      },
      {
        stepNumber: 2,
        title: 'Optical Sensor Sorting',
        description: 'Near-Infrared (NIR) optical sorters identify polymers by resin code (PET vs HDPE vs PVC) and separate colored plastics.',
      },
      {
        stepNumber: 3,
        title: 'Shredding & Hot Washing',
        description: 'Plastics are shredded into uniform flakes and washed in hot caustic baths to scrub off paper labels, adhesives, and food dirt.',
      },
      {
        stepNumber: 4,
        title: 'Extrusion & Pelletization',
        description: 'Clean dried flakes are melted in high-temperature extruders, filtered through fine mesh, and cut into rPET pellets.',
      },
      {
        stepNumber: 5,
        title: 'Manufacturing Output',
        description: 'Pellets are spun into polyester apparel fibers, carpet yarns, or blow-molded into brand new food-grade bottles.',
      },
    ],
    preparationTips: [
      'Empty liquids & rinse food residue thoroughly',
      'Keep plastic caps attached or screwed on tight',
      'Do NOT place soft plastic bags in curbside bins (they entangle sorter gears)',
    ],
    environmentalBenefit: 'Saves 3.2L water and 0.45 kWh energy per bottle while preventing ocean plastic pollution.',
    sampleQuery: 'Clear PET plastic beverage bottle with cap',
  },
  {
    id: 'paper_cardboard',
    name: 'Paper & Corrugated Cardboard',
    category: 'Paper & Cardboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    binType: 'Blue Paper & Cardboard Recycling Bin',
    binColorHex: '#0284c7',
    recyclabilityRating: 'High (Recyclable 5-7 times)',
    commonItems: ['Corrugated shipping boxes', 'Newspapers & magazines', 'Cereal boxes', 'Office paper'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Hydrapulping Slurry',
        description: 'Cardboard and paper are dumped into a large pulper vat with warm water and chemicals, breaking them down into pulp fibers.',
      },
      {
        stepNumber: 2,
        title: 'Centrifugal Screening',
        description: 'Pulp passes through centrifugal screens that spin out heavy debris like staples, plastic packing tape, and glue.',
      },
      {
        stepNumber: 3,
        title: 'De-Inking & Flotation',
        description: 'Air bubbles are injected into the slurry; ink particles attach to the bubbles and float to the surface for skimming.',
      },
      {
        stepNumber: 4,
        title: 'Pressing & Steam Drying',
        description: 'Clean cellulose pulp is sprayed onto continuous wire screens, pressed between rollers, and dried on heated cylinders.',
      },
      {
        stepNumber: 5,
        title: 'Reeling New Paper',
        description: 'The dried continuous paper sheet is wound onto giant master rolls ready to manufacture new packaging boxes.',
      },
    ],
    preparationTips: [
      'Flatten all shipping boxes to maximize bin space',
      'Remove bubble wrap, tape, and plastic film windows',
      'Keep paper completely dry (wet paper weakens fibers and degrades quality)',
    ],
    environmentalBenefit: 'Saves 17 trees, 26,000L water, and 4,000 kWh energy per ton of recycled paper.',
    sampleQuery: 'Corrugated brown shipping box and flattened cardboard',
  },
  {
    id: 'metal',
    name: 'Aluminum & Steel Metal Cans',
    category: 'Metal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    binType: 'Blue / Yellow Metals Bin',
    binColorHex: '#d97706',
    recyclabilityRating: 'Very High (100% Infinitely Recyclable)',
    commonItems: ['Aluminum beverage cans', 'Steel food tins', 'Clean aluminum foil', 'Metal jar lids'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Magnetic & Eddy Separation',
        description: 'Electromagnets pull steel food cans, while Eddy Current separators create magnetic fields that propel non-magnetic aluminum into dedicated chutes.',
      },
      {
        stepNumber: 2,
        title: 'Shredding & Decoating',
        description: 'Cans are shredded into small chips and passed through hot air chambers to burn off decorative lacquers and print coatings.',
      },
      {
        stepNumber: 3,
        title: 'High-Temperature Smelting',
        description: 'Clean metal chips are fed into furnaces melted at 660°C (aluminum) or 1500°C (steel), using 95% less energy than mining raw bauxite ore.',
      },
      {
        stepNumber: 4,
        title: 'Ingot Casting & Rolling',
        description: 'Molten metal is cast into massive 27-ton ingots and rolled under immense hydraulic pressure into paper-thin aluminum sheets.',
      },
      {
        stepNumber: 5,
        title: 'Can Re-Manufacturing',
        description: 'Sheet coils are stamped and cupped into fresh cans, returning to supermarket shelves in as little as 60 days!',
      },
    ],
    preparationTips: [
      'Rinse out leftover food and beverages',
      'Push sharp metal can lids inside the can body',
      'Ball up clean aluminum foil into a single sphere at least 2 inches wide',
    ],
    environmentalBenefit: 'Recycling aluminum uses 95% less energy than producing new metal from raw ore.',
    sampleQuery: 'Recyclable aluminum soda beverage can',
  },
  {
    id: 'glass',
    name: 'Glass Containers & Jars',
    category: 'Glass',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    binType: 'Green / Amber / Clear Glass Banks',
    binColorHex: '#16a34a',
    recyclabilityRating: 'Very High (100% Infinitely Recyclable)',
    commonItems: ['Glass beverage bottles', 'Jam & pickle jars', 'Glass food containers'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Color Sorting',
        description: 'Glass containers are separated by color (clear/flint, amber/brown, and green) using optical camera sorters.',
      },
      {
        stepNumber: 2,
        title: 'Cullet Crushing',
        description: 'Glass is crushed, screened, and vacuumed to remove ceramic bits, paper labels, and metal caps, creating uniform "cullet".',
      },
      {
        stepNumber: 3,
        title: 'Furnace Smelting',
        description: 'Cullet is mixed with soda ash and sand, then melted at 1500°C in glass furnaces (reducing carbon emissions by 20%).',
      },
      {
        stepNumber: 4,
        title: 'Blow Molding',
        description: 'Droplets of molten glass ("gob") drop into automated molds where compressed air blows them into brand new bottles and jars.',
      },
    ],
    preparationTips: [
      'Rinse jars to remove food and oil residue',
      'Remove metal caps or corks and recycle separately',
      'Do NOT include drinking glasses, pyrex, or window panes (different melting temps)',
    ],
    environmentalBenefit: 'Every ton of glass recycled saves 1.2 tons of raw natural resources.',
    sampleQuery: 'Clear glass food container jar with metal lid',
  },
  {
    id: 'organic',
    name: 'Organic & Food Waste Composting',
    category: 'Organic / Food Waste',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    binType: 'Green Organics / Brown Compost Bin',
    binColorHex: '#15803d',
    recyclabilityRating: '100% Compostable / Bio-Degradable',
    commonItems: ['Fruit & vegetable scraps', 'Coffee grounds & tea bags', 'Eggshells', 'Garden clippings & leaves'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Organics Sorting & Shredding',
        description: 'Raw food waste is depackaged, screened for non-biodegradables, and shredded into uniform organic fragments.',
      },
      {
        stepNumber: 2,
        title: 'Aerobic Windrow Composting',
        description: 'Material is piled into long outdoor windrows or indoor in-vessel digesters where temperature reaches 55–65°C to kill pathogens.',
      },
      {
        stepNumber: 3,
        title: 'Microbial Breakdown',
        description: 'Thermophilic microbes and fungi digest complex organic molecules over 4–8 weeks, releasing water vapor and CO₂ naturally.',
      },
      {
        stepNumber: 4,
        title: 'Anaerobic Biogas Capture',
        description: 'In sealed digesters, anaerobic bacteria convert food waste into biomethane gas to generate clean electricity.',
      },
      {
        stepNumber: 5,
        title: 'Nutrient-Rich Soil Product',
        description: 'Finished compost is screened and distributed to local farms and gardens as natural, fertilizer-rich humus.',
      },
    ],
    preparationTips: [
      'Remove plastic produce stickers from fruit skins',
      'Use certified compostable paper liners or unlined buckets',
      'Do NOT include plastic bags, diapers, or treated wood',
    ],
    environmentalBenefit: 'Diverts methane-generating organics from landfills, creating nutrient-rich natural soil.',
    sampleQuery: 'Organic food scraps apple core and vegetable peelings',
  },
  {
    id: 'ewaste',
    name: 'E-Waste & Electronics',
    category: 'E-Waste / Hazardous',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    binType: 'Red / Specialized E-Waste Collection Point',
    binColorHex: '#dc2626',
    recyclabilityRating: 'Specialized Facility Required',
    commonItems: ['Rechargeable & AA batteries', 'Old smartphones & tablets', 'Circuit boards & cables', 'Small home appliances'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Hazard & Battery Isolation',
        description: 'Technicians manually dismantle devices to isolate hazardous lithium-ion batteries, mercury switches, and cathode-ray tubes.',
      },
      {
        stepNumber: 2,
        title: 'Mechanical Granulation',
        description: 'Electronics pass through heavy-duty industrial shredders, reducing components to millimeter-sized particulate matter.',
      },
      {
        stepNumber: 3,
        title: 'Hydrometallurgical Extraction',
        description: 'Chemical leaching and electro-refining recover high-purity gold, silver, copper, cobalt, and rare earth elements.',
      },
      {
        stepNumber: 4,
        title: 'Supply Chain Re-Entry',
        description: 'Refined precious metals are returned to semiconductor manufacturers to build new high-tech electronics.',
      },
    ],
    preparationTips: [
      'Tape battery terminals with clear tape to prevent fire risk',
      'Wipe personal data & perform factory resets on electronics',
      'NEVER throw batteries in regular trash or standard curbside recycling bins!',
    ],
    environmentalBenefit: 'Recovers critical rare minerals like Cobalt and Lithium while preventing toxic heavy metal landfill leaching.',
    sampleQuery: 'Rechargeable AA battery cell and household electronics',
  },
  {
    id: 'trash',
    name: 'General Non-Recyclable Trash',
    category: 'General Trash',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    binType: 'Black / Dark Gray Landfill Bin',
    binColorHex: '#4b5563',
    recyclabilityRating: 'Non-Recyclable',
    commonItems: ['Greasy pizza boxes with cheese', 'Styrofoam packaging', 'Used diapers & wipes', 'Composite multi-layer snack bags'],
    recyclingProcess: [
      {
        stepNumber: 1,
        title: 'Sanitary Landfill Compaction',
        description: 'Trash is deposited in double-lined, engineered landfill cells equipped with methane gas capture wells and leachate collection pipes.',
      },
      {
        stepNumber: 2,
        title: 'Waste-to-Energy Incineration',
        description: 'In modern facilities, trash is incinerated at 1000°C to turn turbine boilers, producing electricity with flue gas scrubbers.',
      },
    ],
    preparationTips: [
      'Bag waste tightly to prevent wind litter',
      'Check if item can be reused, repaired, or donated before binning',
      'Avoid mixing hazardous materials into general landfill trash',
    ],
    environmentalBenefit: 'Proper landfill encapsulation prevents environmental contamination when recycling is not possible.',
    sampleQuery: 'Greasy contaminated cardboard pizza box',
  },
];
