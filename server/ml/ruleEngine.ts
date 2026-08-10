import { WasteCategory } from './types';

export interface RegionalGuidance {
  category: WasteCategory;
  region: string;
  binType: string;
  binColorHex: string;
  materialType: string;
  recyclabilityRating: string;
  prepSteps: string[];
  doNotDo: string[];
  contaminationWarnings: string[];
  environmentalImpact: {
    carbonSavedKg: number;
    waterSavedLiters: number;
    energySavedKWh: number;
  };
}

export class RuleEngine {
  public static evaluateRules(
    predictedCategory: WasteCategory,
    itemName: string,
    region: string = 'North America'
  ): RegionalGuidance {
    const isNorthAmerica = region.toLowerCase().includes('north america') || region.toLowerCase().includes('us') || region.toLowerCase().includes('canada');
    const isEU = region.toLowerCase().includes('eu') || region.toLowerCase().includes('europe') || region.toLowerCase().includes('uk');
    const isAsia = region.toLowerCase().includes('asia') || region.toLowerCase().includes('japan') || region.toLowerCase().includes('singapore');
    const isIndia = region.toLowerCase().includes('india') || region.toLowerCase().includes('south asia');

    const lowerItem = itemName.toLowerCase();
    const isGreasy = lowerItem.includes('pizza') || lowerItem.includes('grease') || lowerItem.includes('oil');
    const isBattery = lowerItem.includes('battery') || lowerItem.includes('lithium');

    switch (predictedCategory) {
      case 'Plastic':
        return {
          category: 'Plastic',
          region,
          binType: isEU ? 'Yellow Packaging Bin (Gelbe Tonne)' : isAsia ? 'Resource Plastic Recycling Container' : 'Blue Curbside Recycling Bin',
          binColorHex: isEU ? '#eab308' : isAsia ? '#06b6d4' : '#2563eb',
          materialType: 'Thermoplastic (PET #1, HDPE #2, PP #5)',
          recyclabilityRating: 'High (Types #1, #2, #5)',
          prepSteps: [
            'Empty liquids and rinse container completely',
            'Squeeze or flatten bottle to optimize bin storage',
            'Keep cap attached if local facility uses optical sorting caps',
          ],
          doNotDo: [
            'Do NOT place plastic grocery bags or soft stretch film in standard curbside bins',
            'Do NOT leave food liquids inside (causes batch rejection at MRF)',
          ],
          contaminationWarnings: isGreasy ? ['Food grease detected on container - rinse thoroughly before bin drop-off!'] : [],
          environmentalImpact: {
            carbonSavedKg: 0.18,
            waterSavedLiters: 3.4,
            energySavedKWh: 0.52,
          },
        };

      case 'Paper & Cardboard':
        return {
          category: 'Paper & Cardboard',
          region,
          binType: isEU ? 'Blue Paper Bin (Papiertonne)' : isIndia ? 'Dry Waste Bin (Khatta-Sookha)' : 'Blue Paper/Cardboard Bin',
          binColorHex: '#1d4ed8',
          materialType: 'Cellulose Fibers (Corrugated Box / Office Paper)',
          recyclabilityRating: 'Very High (when dry and oil-free)',
          prepSteps: [
            'Flatten corrugated shipping boxes completely',
            'Remove plastic packing tape and shipping label pouches',
            'Keep paper dry and free of moisture',
          ],
          doNotDo: [
            'Do NOT recycle paper soaked in food grease, oil, or cheese (grease ruins paper pulp batch)',
            'Do NOT include wax-coated beverage cups',
          ],
          contaminationWarnings: isGreasy
            ? ['CRITICAL CONTAMINATION ALERT: Grease detected! Grease-soiled cardboard CANNOT be recycled into paper pulp. Dispose in Organic/Compost or General Trash!']
            : [],
          environmentalImpact: {
            carbonSavedKg: 0.31,
            waterSavedLiters: 8.2,
            energySavedKWh: 0.85,
          },
        };

      case 'Metal':
        return {
          category: 'Metal',
          region,
          binType: isEU ? 'Yellow Metal Packaging Bin' : 'Blue Can & Metal Recycling Bin',
          binColorHex: '#0284c7',
          materialType: 'Non-Ferrous Aluminum & Ferrous Tin/Steel',
          recyclabilityRating: 'Infinite (100% Recyclable without quality loss)',
          prepSteps: [
            'Rinse out leftover beverage or canned food remnants',
            'Lightly press cans or leave uncrushed for automatic eddy-current sorting',
          ],
          doNotDo: [
            'Do NOT place pressurized full aerosol cans in standard bins',
            'Do NOT mix propane cylinders or toxic metal containers',
          ],
          contaminationWarnings: [],
          environmentalImpact: {
            carbonSavedKg: 0.45,
            waterSavedLiters: 12.0,
            energySavedKWh: 1.85,
          },
        };

      case 'Glass':
        return {
          category: 'Glass',
          region,
          binType: isEU ? 'Color-Separated Glass Igloo (Altglas Container)' : 'Green/Clear Glass Recycling Drop-off',
          binColorHex: '#059669',
          materialType: 'Silica Flint, Amber, or Emerald Bottle Glass',
          recyclabilityRating: 'Infinite (Melts at 1500°C without degradation)',
          prepSteps: [
            'Rinse out food or wine residue',
            'Remove metal or cork stoppers',
            'Sort by color (Clear / Brown / Green) if required in region',
          ],
          doNotDo: [
            'Do NOT mix Pyrex heat-resistant cookware, ceramic mugs, or window glass (different melting points)',
            'Do NOT smash glass before dropping into container',
          ],
          contaminationWarnings: [],
          environmentalImpact: {
            carbonSavedKg: 0.28,
            waterSavedLiters: 2.1,
            energySavedKWh: 0.62,
          },
        };

      case 'Organic / Food Waste':
        return {
          category: 'Organic / Food Waste',
          region,
          binType: isEU ? 'Brown Bio-Bin (Biotonne)' : isNorthAmerica ? 'Green Organics / Compost Bin' : 'Green Food Waste Bin',
          binColorHex: '#16a34a',
          materialType: 'Biodegradable Organic Biomass',
          recyclabilityRating: 'Compostable / Anaerobic Digestion Energy Source',
          prepSteps: [
            'Scrape food waste directly into green compost caddy',
            'Use certified BPI/EN13432 compostable paper bags',
          ],
          doNotDo: [
            'Do NOT put conventional plastic bags or plastic cutlery into bio-bins',
            'Do NOT include treated wood or toxic plant pesticides',
          ],
          contaminationWarnings: [],
          environmentalImpact: {
            carbonSavedKg: 0.22,
            waterSavedLiters: 1.5,
            energySavedKWh: 0.35,
          },
        };

      case 'E-Waste / Hazardous':
        return {
          category: 'E-Waste / Hazardous',
          region,
          binType: 'Red / Specialized Hazardous E-Waste Drop-off Center',
          binColorHex: '#dc2626',
          materialType: 'Lithium / Cobalt Heavy Metals & Electronic Circuitry',
          recyclabilityRating: 'Specialized Extraction Only (Fire & Toxic Hazard)',
          prepSteps: [
            'Tape battery terminals with clear electrical tape to prevent short circuits',
            'Store in cool, dry place away from flammable materials',
            'Take to certified municipal E-Waste collection facility or retail drop-box',
          ],
          doNotDo: [
            'STRICT PROHIBITION: NEVER throw batteries into curbside trash or recycling bins (causes severe compaction fires in garbage trucks)',
          ],
          contaminationWarnings: isBattery
            ? ['FIRE HAZARD WARNING: Lithium batteries compress under compaction and cause truck fires. Drop off ONLY at dedicated battery bins!']
            : ['HAZARDOUS WASTE WARNING: Requires certified drop-off depot!'],
          environmentalImpact: {
            carbonSavedKg: 0.85,
            waterSavedLiters: 45.0,
            energySavedKWh: 3.2,
          },
        };

      default:
        return {
          category: 'General Trash',
          region,
          binType: 'Black / Dark Grey Residual Waste Bin (Landfill / Waste-to-Energy)',
          binColorHex: '#475569',
          materialType: 'Mixed Non-Recyclable Composite Waste',
          recyclabilityRating: 'None (Thermal Incineration / Controlled Landfill)',
          prepSteps: [
            'Bag securely to contain odors and litter',
            'Compress volume if possible',
          ],
          doNotDo: [
            'Do NOT dump hazardous chemicals, paints, or liquid batteries',
          ],
          contaminationWarnings: isGreasy ? ['Cardboard is grease-soiled and must go to residual waste.'] : [],
          environmentalImpact: {
            carbonSavedKg: 0.05,
            waterSavedLiters: 0.2,
            energySavedKWh: 0.1,
          },
        };
    }
  }
}
