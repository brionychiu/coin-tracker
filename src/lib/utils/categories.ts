import { LayoutGrid } from 'lucide-react';
import React from 'react';

import { Category } from '@/types/category';

import { iconMap } from '../constants/iconMap';

export const getCategoryLabelById = (
  categoryId: string,
  categoryMap: Record<string, Category>,
): string => {
  const category = categoryMap[categoryId];
  if (!category) return '未知分類';

  return category.label;
};

export const getCategoryIconById = (
  categoryId: string,
  categoryMap: Record<string, Category>,
): React.JSX.Element => {
  const category = categoryMap[categoryId];
  if (!category) {
    return React.createElement(LayoutGrid, { className: 'h-6 w-6' });
  }

  const Icon = iconMap[category.icon as keyof typeof iconMap] ?? LayoutGrid;
  return React.createElement(Icon, { className: 'h-6 w-6' });
};
