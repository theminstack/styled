import { type ChangeEvent, type ReactElement, useCallback } from 'react';

export interface SelectItem {
  value: string;
  label?: string;
}

export interface SelectProps {
  $label: string;
  items: SelectItem[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

export function Select({ $label, items, selectedValue, onChange }: SelectProps): ReactElement {
  const $onChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => onChange?.(ev.target.value), [onChange]);

  return (
    <div className={'select'}>
      <label className={'select__label'}>{$label}</label>
      <select className={'select__input'} value={selectedValue} onChange={$onChange}>
        {items.map(({ value, label = value }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
