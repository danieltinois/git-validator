import { GitValidatorConfig } from '../config';
import { findClosest } from '../utils/similarity';
import { invalid, valid, ValidationResult } from './validation';

const VALID_BRANCH_NAME_PATTERN = /^[\p{L}0-9._-]+$/u;
const INVALID_BRANCH_NAME_CHARS_PATTERN = /[^\p{L}0-9._-]/gu;

export function validateBranchRules(
  branch: string,
  config: GitValidatorConfig
): ValidationResult {
  const normalizedBranch = branch.trim();
  const prefixes = config.branchPrefixes;

  if (!normalizedBranch) {
    return invalid(
      'Branch name cannot be empty.',
      `${prefixes[0]}/my-feature`
    );
  }

  const [prefix, ...rest] = normalizedBranch.split('/');
  const branchName = rest.join('/');

  if (!normalizedBranch.includes('/')) {
    return invalid(
      `Branch must start with one of: ${prefixes.join(', ')}`,
      `${prefixes[0]}/${normalizedBranch}`
    );
  }

  if (!prefixes.includes(prefix)) {
    const closest = findClosest(prefix, prefixes);

    return invalid(
      `Prefix "${prefix}" is not valid.\n   → Allowed prefixes: ${prefixes.join(
        ', '
      )}`,
      `${closest}/${branchName || 'my-branch'}`
    );
  }

  if (!branchName) {
    return invalid('Branch name cannot be empty.', `${prefix}/my-feature`);
  }

  if (!VALID_BRANCH_NAME_PATTERN.test(branchName)) {
    const suggestion = branchName.replace(INVALID_BRANCH_NAME_CHARS_PATTERN, '-');

    return invalid(
      'Branch name contains invalid characters.',
      `${prefix}/${suggestion}`
    );
  }

  return valid();
}
