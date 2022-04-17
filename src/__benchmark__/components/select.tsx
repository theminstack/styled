import { type ChangeEvent, type ReactElement, useCallback } from 'react';

interface SelectItem {
  value: string;
  label?: string;
}

interface SelectProps {
  $label: string;
  items: SelectItem[];
  selectedValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

function Select({ $label, items, selectedValue, disabled = false, onChange }: SelectProps): ReactElement {
  const $onChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => onChange?.(ev.target.value), [onChange]);

  return (
    <div className={'select'}>
      <label className={'select__label'}>{$label}</label>
      <select className={'select__input'} value={selectedValue} onChange={$onChange} disabled={disabled}>
        {items.map(({ value, label = value }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { type SelectItem, Select };
