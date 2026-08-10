import { WASTE_TYPES, WasteTypeInfo } from './wasteTypes';

export interface SampleWasteItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badgeColor: string;
}

export const SAMPLE_WASTE_ITEMS: SampleWasteItem[] = WASTE_TYPES.map((wt) => ({
  id: wt.id,
  name: wt.name,
  category: wt.category,
  description: wt.sampleQuery,
  badgeColor: wt.badgeColor,
}));
