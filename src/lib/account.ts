export const accountOptions = [
  { value: 'cash', label: '現金' },
  { value: 'bank', label: '銀行' },
  { value: 'credit', label: '信用卡' },
];

export const getAccountLabel = (value: string): string => {
  return accountOptions.find((option) => option.value === value)?.label || '未知帳戶';
};