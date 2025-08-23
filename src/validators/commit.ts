/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
export function validateCommitMessage(message: string): string | null {
  const regex =
    /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([\w\-]+\))?: .{1,50}$/;

  if (!regex.test(message)) {
    return '❌ Invalid commit. Use the Conventional Commits pattern (e.g., feat: add login).';
  }

  return null;
}
