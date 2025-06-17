import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merge objects with special handling for nested properties
 * More flexible than shallow spread for store state merging
 */
export function mergeWithConfig<T extends { config?: object }>(
  base: T,
  overrides?: Partial<T>,
): T {
  if (!overrides) return base;

  const result = { ...base, ...overrides };

  // Special handling for config object
  if (base.config && overrides.config) {
    result.config = { ...base.config, ...overrides.config };
  }

  return result;
}
