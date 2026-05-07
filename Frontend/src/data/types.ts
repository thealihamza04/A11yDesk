import type { FC } from 'react';

export type Level = 'A' | 'AA' | 'AAA' | 'Technique';

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  wcag: string;
  wcagTitle: string;
  wcagUrl: string;
  level: Level;
  obsolete?: boolean;
  description: string;
  whyItMatters: string;
  badDemo: FC;
  goodDemo: FC;
}

export interface Category {
  id: string;
  label: string;
}
