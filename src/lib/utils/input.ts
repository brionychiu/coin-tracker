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
