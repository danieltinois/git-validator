/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
import { loadConfig } from '../config';

export function validateBranchName(branch: string): string | null {
  const config = loadConfig();
  const prefixes = config.branchPrefixes.join('|');
  const regex = new RegExp(`^(${prefixes})/[a-zA-Z0-9._-]+$`);

  if (!regex.test(branch)) {
    return `❌ Invalid branch name. Use one of: ${config.branchPrefixes.join(
      ', '
    )}/<name>`;
  }

  return null;
}
