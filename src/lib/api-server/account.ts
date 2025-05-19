import { adminDb } from '@/lib/firebaseAdmin';
import { Account } from '@/types/account';

export async function getVisibleAccounts(uid: string): Promise<Account[]> {
  const systemQuery = adminDb
    .collection('accounts')
    .where('createdBy', '==', 'system')
    .orderBy('createAt', 'asc');

  const userQuery = adminDb
    .collection('accounts')
    .where('createdBy', '==', uid)
    .orderBy('createAt', 'asc');

  const [systemSnap, userSnap] = await Promise.all([
    systemQuery.get(),
    userQuery.get(),
  ]);

  const systemAccounts = systemSnap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.label,
        createAt: data.createAt,
        createdBy: data.createdBy,
        deletedBy: data.deletedBy,
      };
    })
    .filter((acc: Account) => !acc.deletedBy?.includes(uid));

  const userAccounts = userSnap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.label,
        createAt: data.createAt,
        createdBy: data.createdBy,
        deletedBy: data.deletedBy,
      };
    })
    .filter((acc: Account) => !acc.deletedBy?.includes(uid));

  return [...systemAccounts, ...userAccounts];
}
