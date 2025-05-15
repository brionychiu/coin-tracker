import { currencyGroups } from '../constants/currencyOptions';

export const handleNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (
    !/\d/.test(e.key) &&
    !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
  ) {
    e.preventDefault();
  }
};

export function parseCurrencyValue(fullValue: string) {
  const [group, value] = fullValue.split('-');
  return { group, value };
}

export function getCurrencyLabel(fullValue: string): string {
  const { group, value } = parseCurrencyValue(fullValue);

  const groupData = currencyGroups.find((g) => g.value === group);
  const currency = groupData?.options.find((c) => c.value === value);

  return currency?.label ?? '未知貨幣';
}
