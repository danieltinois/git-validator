"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPrePushHook = installPrePushHook;
const fs_1 = require("fs");
const path_1 = require("path");
function buildHookScript(usesHusky) {
    const huskyBootstrap = usesHusky
        ? `. "$(dirname "$0")/_/husky.sh"

`
        : '';
    return `#!/bin/sh
${huskyBootstrap}echo "🚀 Running git-validator pre-push..."

branch=$(git rev-parse --abbrev-ref HEAD)

# Validate branch
./node_modules/.bin/git-validator branch "$branch" || exit 1

# Validate only the last commit
last_commit=$(git log -1 --pretty=format:%B)
./node_modules/.bin/git-validator commit "$last_commit" || exit 1

# Validate files from the last commit
last_commit_files=$(git diff-tree --no-commit-id --name-only -r HEAD)
./node_modules/.bin/git-validator files "$last_commit_files" || exit 1

echo "✅ Branch, last commit and files are valid. Push allowed!"
`;
}
function getHookConfig(cwd) {
    if ((0, fs_1.existsSync)((0, path_1.join)(cwd, '.husky'))) {
        return {
            hookPath: (0, path_1.join)(cwd, '.husky/pre-push'),
            script: buildHookScript(true),
            toolName: '.husky/pre-push',
        };
    }
    return {
        hookPath: (0, path_1.join)(cwd, '.git/hooks/pre-push'),
        script: buildHookScript(false),
        toolName: '.git/hooks/pre-push',
    };
}
function installPrePushHook(cwd = process.cwd()) {
    const { hookPath, script, toolName } = getHookConfig(cwd);
    console.log(`🔎 Installing hook in ${toolName}`);
    (0, fs_1.writeFileSync)(hookPath, script, { encoding: 'utf-8' });
    (0, fs_1.chmodSync)(hookPath, 0o755);
    console.log(`✅ Pre-push hook installed successfully at ${hookPath}`);
}
