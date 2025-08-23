#!/usr/bin/env node
import { chmodSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { validateBranchName } from './validators/branch';
import { validateCommitMessage } from './validators/commit';

const [command, value] = process.argv.slice(2);

if (command === 'init') {
  try {
    let hookPath: string;
    let script: string;

    // Detect if project uses Husky
    if (existsSync(join(process.cwd(), '.husky'))) {
      hookPath = join(process.cwd(), '.husky/pre-push');
      console.log('🔎 Husky detected, installing hook in .husky/pre-push');

      script = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running git-validator pre-push..."

branch=$(git rev-parse --abbrev-ref HEAD)

# Validate branch
./node_modules/.bin/git-validator branch "$branch" || exit 1

# Validate only the last commit (simpler, avoids old history issues)
last_commit=$(git log -1 --pretty=format:%s)
./node_modules/.bin/git-validator commit "$last_commit" || exit 1

echo "✅ Branch and last commit are valid. Push allowed!"
`;
    } else {
      hookPath = join(process.cwd(), '.git/hooks/pre-push');
      console.log(
        '🔎 Husky not detected, installing hook in .git/hooks/pre-push'
      );

      script = `#!/bin/sh
branch=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Running git-validator pre-push..."

# Validate branch
./node_modules/.bin/git-validator branch "$branch" || exit 1

# Validate only the last commit
last_commit=$(git log -1 --pretty=format:%s)
./node_modules/.bin/git-validator commit "$last_commit" || exit 1

echo "✅ Branch and last commit are valid. Push allowed!"
`;
    }

    writeFileSync(hookPath, script, { encoding: 'utf-8' });
    chmodSync(hookPath, 0o755);

    console.log(`✅ Pre-push hook installed successfully at ${hookPath}`);
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
