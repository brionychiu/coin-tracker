import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currencyGroups } from '@/lib/constants/currencyOptions';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="請選擇幣別" />
      </SelectTrigger>
      <SelectContent>
        {currencyGroups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem
                key={`${group.value}-${option.value}`}
                value={`${group.value}-${option.value}`}
              >
                {`${option.label} (${option.value})`}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
