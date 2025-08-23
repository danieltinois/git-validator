#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const branch_1 = require("./validators/branch");
const commit_1 = require("./validators/commit");
const [command, value] = process.argv.slice(2);
if (command === 'init') {
    try {
        const hookPath = (0, path_1.join)(process.cwd(), '.git/hooks/pre-push');
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
        (0, fs_1.writeFileSync)(hookPath, script, { encoding: 'utf-8' });
        (0, fs_1.chmodSync)(hookPath, 0o755);
        console.log('✅ Pre-push hook installed successfully!');
    }
    catch (error) {
        console.error('❌ Error installing hook:', error);
        process.exit(1);
    }
    process.exit(0);
}
if (command === 'commit') {
    const error = (0, commit_1.validateCommitMessage)(value);
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.log('✅ Valid commit!');
}
if (command === 'branch') {
    const branchName = value.trim();
    const error = (0, branch_1.validateBranchName)(branchName);
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.log('✅ Valid branch!');
}
