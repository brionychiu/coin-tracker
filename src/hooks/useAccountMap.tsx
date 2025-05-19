import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { getAccountMap } from '@/lib/api-client/account';
import { Account } from '@/types/account';

export function useAccountMap() {
  const { uid } = useAuth();
  const [accountMap, setAccountMap] = useState<Record<string, Account>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountMap = async () => {
      if (!uid) {
        console.error('使用者未登入，無法取得分類');
        setLoading(false);
        return;
      }

      const map = await getAccountMap(uid);
      setAccountMap(map);
      setLoading(false);
    };

    fetchAccountMap();
  }, [uid]);

  return { accountMap, loading };
}
