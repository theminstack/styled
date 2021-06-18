import { Id } from './Utilities';

/**
 * Helper type which adds styled component props (ie. `className`) to
 * any component props type.
 */
export type WithStyledComponentProps<TProps> = Id<Omit<TProps, 'className'> & { className?: string }>;
