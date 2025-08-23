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
        let hookPath;
        let script;
        // Detect if project uses Husky
        if ((0, fs_1.existsSync)((0, path_1.join)(process.cwd(), '.husky'))) {
            hookPath = (0, path_1.join)(process.cwd(), '.husky/pre-push');
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
        }
        else {
            hookPath = (0, path_1.join)(process.cwd(), '.git/hooks/pre-push');
            console.log('🔎 Husky not detected, installing hook in .git/hooks/pre-push');
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
        (0, fs_1.writeFileSync)(hookPath, script, { encoding: 'utf-8' });
        (0, fs_1.chmodSync)(hookPath, 0o755);
        console.log(`✅ Pre-push hook installed successfully at ${hookPath}`);
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
