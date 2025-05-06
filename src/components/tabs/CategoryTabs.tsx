import { auth } from '@/lib/firebase';
import { CirclePlus, Trash2 } from 'lucide-react';

import { useEffect, useState } from 'react';

import { getVisibleCategories } from '@/app/api/categories/route';
import AddCategoryDialog from '@/components/modal/AddCategory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { iconMap } from '@/lib/iconMap';
import { Category } from '@/types/category';

interface TabsCategoryProps {
  isEdit: boolean;
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

export default function CategoryTabs({
  isEdit,
  value,
  onChange,
}: TabsCategoryProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const uid = auth.currentUser?.uid;
  const loadCategories = async () => {
    const result = await getVisibleCategories(uid, activeTab);

    if (Array.isArray(result)) {
      setCategories(result);
      if (result.length > 0) {
        onChange?.(result[0].label);
      }
    } else {
      console.error('無法取得類別', result);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [activeTab, uid]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'expenses' | 'income');
  };

  const handleDelete = () => {
    if (value && value !== 'add') {
      console.log('刪除項目:', value);
    }
  };

  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      <Tabs
        value={activeTab}
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
              {categories.map(({ icon, label }, index) => {
                const Icon = iconMap[icon] || iconMap['LayoutGrid'];
                return (
                  <TabButton
                    key={index}
                    label={label}
                    icon={Icon}
                    isSelected={value === label}
                    activeTab={activeTab}
                    onClick={() => onChange?.(label)}
                    isEdit={isEdit}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {isEdit && (
        <div className="mt-6 flex items-center justify-end gap-4 sm:mt-0">
          <Button
            type="button"
            variant="iconHover"
            size="icon"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <CirclePlus className="size-5" />
          </Button>
          <Button
            type="button"
            variant="iconHover"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      )}
      {isEdit && (
        <AddCategoryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          type={activeTab}
          onAddSuccess={loadCategories}
        />
      )}
    </div>
  );
}
