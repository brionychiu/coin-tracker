'use client';
import { useState } from 'react';

import CategoryTabs from '@/components/tabs/CategoryTabs';

import AccountManager from './AccountManager';

export default function SettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  return (
    <div className="mx-auto h-full w-full max-w-6xl bg-white">
      <div>
        <h2 className="mb-4 font-semibold">記帳類別</h2>
        <CategoryTabs
          isEdit={true}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 font-semibold">記帳帳戶</h2>
        <AccountManager />
      </div>
    </div>
  );
}
