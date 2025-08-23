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

# Validate branch
npx git-validator branch "$branch" || exit 1

# Validate commits that are not yet on remote
for commit in $(git log origin/$branch..HEAD --pretty=format:%s 2>/dev/null); do
  npx git-validator commit "$commit" || exit 1
done

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
    console.log('DEBUG argv:', process.argv);
    console.log('DEBUG command:', command);
    console.log('DEBUG raw value:', JSON.stringify(value));
    const branchName = value.trim();
    console.log('DEBUG after trim:', JSON.stringify(branchName));
    const error = (0, branch_1.validateBranchName)(branchName);
    if (error) {
        console.error('DEBUG regex test:', /^(feature|hotfix|release|bugfix|support)\/[a-z0-9._-]+$/.test(branchName));
        console.error(error);
        process.exit(1);
    }
    console.log('✅ Valid branch!');
}
