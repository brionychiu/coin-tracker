import { adminDb } from '@/lib/firebaseAdmin';
import { Category } from '@/types/category';

export async function getVisibleCategories(uid: string): Promise<Category[]> {
  const systemQuery = adminDb
    .collection('categories')
    .where('createdBy', '==', 'system')
    .orderBy('createAt', 'asc');

  const userQuery = adminDb
    .collection('categories')
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
        icon: data.icon,
        type: data.type,
        createAt: data.createAt,
        createdBy: data.createdBy,
        deletedBy: data.deletedBy,
      };
    })
    .filter((acc: Category) => !acc.deletedBy?.includes(uid));

  const userAccounts = userSnap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.label,
        icon: data.icon,
        type: data.type,
        createAt: data.createAt,
        createdBy: data.createdBy,
        deletedBy: data.deletedBy,
      };
    })
    .filter((acc: Category) => !acc.deletedBy?.includes(uid));

  return [...systemAccounts, ...userAccounts];
}
