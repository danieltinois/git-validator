import { chmodSync, writeFileSync } from 'fs';
import { join } from 'path';
import { validateBranchName } from './validators/branch';
import { validateCommitMessage } from './validators/commit';

const [command, value] = process.argv.slice(2);

if (command === 'init') {
  try {
    const hookPath = join(process.cwd(), '.git/hooks/pre-push');

    const script = `#!/bin/sh
branch=$(git rev-parse --abbrev-ref HEAD)

# Validate branch
npx git-validator branch "$branch" || exit 1

# Validate commits that are not yet on remote
for commit in $(git log origin/$branch..HEAD --pretty=format:%s 2>/dev/null); do
  npx git-validator commit "$commit" || exit 1
done

echo "✅ Branch and commits are valid. Push allowed!"
`;

    writeFileSync(hookPath, script, { encoding: 'utf-8' });
    chmodSync(hookPath, 0o755);

    console.log('✅ Pre-push hook installed successfully!');
  } catch (error) {
    console.error('❌ Error installing hook:', error);
    process.exit(1);
  }
  process.exit(0);
}

if (command === 'commit') {
  const error = validateCommitMessage(value);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log('✅ Valid commit!');
}

if (command === 'branch') {
  const branchName = value.trim();
  const error = validateBranchName(branchName);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log('✅ Valid branch!');
}
