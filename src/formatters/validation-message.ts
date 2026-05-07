import { ValidationKind, ValidationResult } from '../domain/validation';

function getInvalidLabel(kind: ValidationKind): string {
  if (kind === 'commit') {
    return 'Invalid commit';
  }

  if (kind === 'branch') {
    return 'Invalid branch';
  }

  return 'Invalid files';
}

export function formatValidationResult(
  kind: ValidationKind,
  value: string,
  result: ValidationResult
): string | null {
  if (result.valid) {
    return null;
  }

  const lines = [
    `❌ ${getInvalidLabel(kind)}: "${value}"`,
    `   → ${result.failure.detail}`,
  ];

  if (result.failure.suggestion) {
    lines.push(`   💡 Example: "${result.failure.suggestion}"`);
  }

  return lines.join('\n');
}
