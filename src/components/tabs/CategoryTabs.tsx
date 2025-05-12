import { CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getVisibleCategories } from '@/app/api/categories/route';
import AddCategoryDialog from '@/components/modal/AddCategory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import { useConfirm } from '@/hooks/useConfirmModal';
import { deleteCategory } from '@/lib/api/categories';
import { iconMap } from '@/lib/constants/iconMap';
import { Category } from '@/types/category';

interface TabsCategoryProps {
  isEdit: boolean;
  value?: string;
  categoryId?: string;
  onChange?: (value: string) => void;
}

const TabButton = ({
  label,
  icon: Icon,
  isSelected,
  onClick,
  activeTab,
  isDeleted = false,
}: {
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
  activeTab: 'expense' | 'income';
  isDeleted?: boolean;
}) => {
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
            className={`absolute left-0 right-0 top-1 mx-auto h-8 w-8 rounded-full ${activeTab === 'expense' ? 'bg-red-04' : 'bg-green-01'} opacity-80`}
          />
        )}
        <Icon
          className={`relative z-10 size-6 ${isDeleted ? 'text-gray-02' : ''}`}
        />
      </span>
      <p
        className={`z-10 text-xs font-normal ${
          isDeleted ? 'text-gray-02' : ''
        }`}
      >
        {label}
      </p>
    </Button>
  );
};

export default function CategoryTabs({
  isEdit,
  value,
  categoryId,
  onChange,
}: TabsCategoryProps) {
  const { uid } = useAuth();
  const { confirm, ConfirmModal } = useConfirm();
  const { categoryMap, loading: categoryMapLoading } = useCategoryMap();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDeletedCategory, setIsDeletedCategory] = useState(false);

  const loadCategories = async () => {
    if (!uid) return;
    const result = await getVisibleCategories(uid);

    if (Array.isArray(result)) {
      setCategories(result);

      const deleted =
        !!categoryId && !result.some((acc) => acc.id === categoryId);

      setIsDeletedCategory(deleted);

      if (result.length > 0 && !value) {
        const expenseCategories = result.filter(
          (cat) => cat.type === 'expense',
        );
        onChange?.(expenseCategories[0].id);
      }
    } else {
      console.error('無法取得類別', result);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [uid, categoryMapLoading]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'expense' | 'income');
  };

  const handleDelete = async () => {
    if (!value || !uid) return;

    const selectedCategory = categories.find((c) => c.id === value);
    if (!selectedCategory) return;

    confirm({
      title: '確認刪除',
      message: `確定要刪除「${selectedCategory.label}」類別嗎？此操作無法復原。`,
      onConfirm: async () => {
        try {
          await deleteCategory({ uid, categoryId: selectedCategory.id });
          await loadCategories();
          toast.success('刪除成功！');
        } catch (error) {
          console.error('刪除類別失敗', error);
          toast.error('刪除失敗，請稍後再試');
        }
      },
    });
  };

  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          {['expense', 'income'].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === 'expense' ? '支出' : '收入'}
            </TabsTrigger>
          ))}
        </TabsList>

        {['expense', 'income'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {categories
                .filter((cat) => cat.type === tab)
                .map(({ id, icon, label }, index) => {
                  const Icon = iconMap[icon] || iconMap['LayoutGrid'];
                  return (
                    <TabButton
                      key={index}
                      label={label}
                      icon={Icon}
                      isSelected={value === id}
                      activeTab={activeTab}
                      onClick={() => onChange?.(id)}
                    />
                  );
                })}
              {isDeletedCategory &&
                categoryId &&
                categoryMap[categoryId]?.type === tab &&
                (() => {
                  const icon = categoryMap[categoryId]?.icon;
                  const Icon = iconMap[icon] || iconMap['LayoutGrid'];
                  const label = categoryMap[categoryId]?.label || '已刪除類別';
                  return (
                    <TabButton
                      key="deleted"
                      label={label}
                      icon={Icon}
                      isSelected={value === categoryId}
                      activeTab={tab}
                      onClick={() => onChange?.(categoryId)}
                      isDeleted={true}
                    />
                  );
                })()}
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
      {ConfirmModal}
    </div>
  );
}
