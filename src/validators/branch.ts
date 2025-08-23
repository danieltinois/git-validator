/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
export function validateBranchName(branch: string): string | null {
  const regex = /^(feature|hotfix|release|bugfix|support)\/[a-z0-9._-]+$/;

  if (!regex.test(branch)) {
    return '❌ Invalid branch name. Use the Git Flow pattern (e.g., feature/new-feature).';
  }

  return null;
}
