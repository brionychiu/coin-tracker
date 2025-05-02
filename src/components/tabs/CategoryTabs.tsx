import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

interface TabsCategoryProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TabButton = ({
  label,
  icon: Icon,
  isSelected,
  onClick,
  activeTab,
}: any) => {
  const bgColor = activeTab === 'expenses' ? 'bg-red-04' : 'bg-green-01';

  return (
    <Button
      variant="tabHover"
      className="flex flex-col items-center gap-1"
      type="button"
      onClick={onClick}
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        {isSelected && (
          <span
            className={`absolute left-0 right-0 top-1 mx-auto h-8 w-8 rounded-full ${bgColor} opacity-80`}
          />
        )}
        <Icon className="relative z-10 size-6" />
      </span>
      <p className="z-10 text-xs font-normal">{label}</p>
    </Button>
  );
};

export default function CategoryTabs({ value, onChange }: TabsCategoryProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

  const categories =
    activeTab === 'expenses' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'expenses' | 'income');
    const firstCategory = (
      tab === 'expenses' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    )[0];
    onChange?.(firstCategory.label);
  };

  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      <Tabs
        value={activeTab}
        defaultValue={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          {['expenses', 'income'].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === 'expenses' ? '支出' : '收入'}
            </TabsTrigger>
          ))}
        </TabsList>

        {['expenses', 'income'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {categories.map(({ icon: Icon, label }, index) => (
                <TabButton
                  key={index}
                  label={label}
                  icon={Icon}
                  isSelected={value === label}
                  activeTab={activeTab}
                  onClick={() => onChange?.(label)}
                />
              ))}
              <TabButton
                label="新增"
                icon={CirclePlus}
                isSelected={value === 'add'}
                activeTab={activeTab}
                onClick={() => {
                  onChange?.('add');
                }}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
