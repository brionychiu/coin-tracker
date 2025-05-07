import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { getCategoryMap } from '@/lib/api/categories';
import { Category } from '@/types/category';

export function useCategoryMap() {
  const { uid } = useAuth();
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryMap = async () => {
      if (!uid) {
        console.error('使用者未登入，無法取得分類');
        setLoading(false);
        return;
      }

      const map = await getCategoryMap();
      setCategoryMap(map);
      setLoading(false);
    };

    fetchCategoryMap();
  }, []);

  return { categoryMap, loading };
}
