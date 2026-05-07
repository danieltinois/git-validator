/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
import { GitValidatorConfig, loadConfig } from '../config';
import { validateCommitRules } from '../domain/commit';
import { formatValidationResult } from '../formatters/validation-message';

export function validateCommitMessage(
  message: string,
  config: GitValidatorConfig = loadConfig()
): string | null {
  const header = message.trim().split('\n')[0];
  const result = validateCommitRules(message, config);

  return formatValidationResult('commit', header, result);
}
