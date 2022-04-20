import { type ChangeEvent, type ReactElement, useCallback } from 'react';

type SelectItem = {
  readonly label?: string;
  readonly value: string;
};

type SelectProps = {
  readonly $label: string;
  readonly disabled?: boolean;
  readonly items: readonly SelectItem[];
  readonly onChange?: (value: string) => void;
  readonly selectedValue?: string;
};

const Select = ({ $label, items, selectedValue, disabled = false, onChange }: SelectProps): ReactElement => {
  const $onChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value), [onChange]);

  return (
    <div className={'select'}>
      <label className={'select__label'}>{$label}</label>
      <select className={'select__input'} value={selectedValue} onChange={$onChange} disabled={disabled}>
        {items.map(({ value, label = value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { type SelectItem, Select };
