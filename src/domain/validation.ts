export type ValidationKind = 'commit' | 'branch' | 'files';

export interface ValidationFailure {
  detail: string;
  suggestion?: string;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; failure: ValidationFailure };

export function valid(): ValidationResult {
  return { valid: true };
}

export function invalid(
  detail: string,
  suggestion?: string
): ValidationResult {
  return {
    valid: false,
    failure: {
      detail,
      suggestion,
    },
  };
}
