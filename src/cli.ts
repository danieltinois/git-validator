#!/usr/bin/env node
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

echo "🚀 Running git-validator pre-push..."

# Validate branch
./node_modules/.bin/git-validator branch "$branch" || exit 1

# Check if branch exists on origin
if git show-ref --verify --quiet refs/remotes/origin/$branch; then
  echo "🔎 Validating commits not yet pushed..."
  git log origin/$branch..HEAD --pretty=format:%s | while IFS= read -r commit; do
    ./node_modules/.bin/git-validator commit "$commit" || exit 1
  done
else
  echo "ℹ️ First push of this branch, validating only the last commit..."
  last_commit=$(git log -1 --pretty=format:%s)
  ./node_modules/.bin/git-validator commit "$last_commit" || exit 1
fi

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
