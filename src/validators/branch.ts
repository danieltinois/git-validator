/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
import { GitValidatorConfig, loadConfig } from '../config';
import { validateBranchRules } from '../domain/branch';
import { formatValidationResult } from '../formatters/validation-message';

export function validateBranchName(
  branch: string,
  config: GitValidatorConfig = loadConfig()
): string | null {
  const normalizedBranch = branch.trim();
  const result = validateBranchRules(normalizedBranch, config);

  return formatValidationResult('branch', normalizedBranch, result);
}
