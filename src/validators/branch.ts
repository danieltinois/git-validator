/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
import { loadConfig } from '../config';
import { findClosest } from '../utils/similarity';

export function validateBranchName(branch: string): string | null {
  const config = loadConfig();
  const prefixes = config.branchPrefixes;

  const [prefix, ...rest] = branch.split('/');
  const branchName = rest.join('/');

  if (!branch.includes('/')) {
    const suggestion = `${prefixes[0]}/${branch}`;
    return `❌ Invalid branch: "${branch}"
   → Branch must start with one of: ${prefixes.join(', ')}
   💡 Example: "${suggestion}"`;
  }

  if (!prefixes.includes(prefix)) {
    const closest = findClosest(prefix, prefixes);
    const suggestion = `${closest}/${branchName || 'my-branch'}`;
    return `❌ Invalid branch: "${branch}"
   → Prefix "${prefix}" is not valid.
   → Allowed prefixes: ${prefixes.join(', ')}
   💡 Example: "${suggestion}"`;
  }

  if (!branchName) {
    return `❌ Invalid branch: "${branch}"
   → Branch name cannot be empty.
   💡 Example: "${prefix}/my-feature"`;
  }

  const regex = /^[\p{L}0-9._-]+$/u;
  if (!regex.test(branchName)) {
    const suggestion = branchName.replace(/[^\p{L}0-9._-]/gu, '-');
    return `❌ Invalid branch: "${branch}"
   → Branch name contains invalid characters.
   💡 Example: "${prefix}/${suggestion}"`;
  }

  return null;
}
