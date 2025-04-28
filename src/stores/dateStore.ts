import { create } from 'zustand';

interface DateStore {
  date: Date;
  setDate: (newDate: Date) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  date: new Date(),
  setDate: (newDate: Date) => set({ date: newDate }),
}));
