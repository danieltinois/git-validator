/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
import { loadConfig } from '../config';

export function validateCommitMessage(message: string): string | null {
  const config = loadConfig();
  const types = config.commitTypes.join('|');
  const regex = new RegExp(
    `^(${types})(\\([\\w\\-]+\\))?: .{1,${config.maxCommitLength}}$`
  );

  if (!regex.test(message)) {
    return `❌ Invalid commit. Use the Conventional Commits pattern (e.g., feat: add login). Allowed types: ${config.commitTypes.join(
      ', '
    )}. Max length: ${config.maxCommitLength}`;
  }

  return null;
}
