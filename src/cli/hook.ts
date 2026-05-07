import { chmodSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

interface HookConfig {
  hookPath: string;
  script: string;
  toolName: string;
}

function buildHookScript(usesHusky: boolean): string {
  const huskyBootstrap = usesHusky
    ? `. "$(dirname "$0")/_/husky.sh"

`
    : '';

  return `#!/bin/sh
${huskyBootstrap}echo "🚀 Running git-validator-cli pre-push..."

branch=$(git rev-parse --abbrev-ref HEAD)

# Validate branch
./node_modules/.bin/git-validator-cli branch "$branch" || exit 1

# Validate only the last commit
last_commit=$(git log -1 --pretty=format:%B)
./node_modules/.bin/git-validator-cli commit "$last_commit" || exit 1

# Validate files from the last commit
last_commit_files=$(git diff-tree --no-commit-id --name-only -r HEAD)
./node_modules/.bin/git-validator-cli files "$last_commit_files" || exit 1

echo "✅ Branch, last commit and files are valid. Push allowed!"
`;
}

function getHookConfig(cwd: string): HookConfig {
  if (existsSync(join(cwd, '.husky'))) {
    return {
      hookPath: join(cwd, '.husky/pre-push'),
      script: buildHookScript(true),
      toolName: '.husky/pre-push',
    };
  }

  return {
    hookPath: join(cwd, '.git/hooks/pre-push'),
    script: buildHookScript(false),
    toolName: '.git/hooks/pre-push',
  };
}

export function installPrePushHook(cwd = process.cwd()): void {
  const { hookPath, script, toolName } = getHookConfig(cwd);

  console.log(`🔎 Installing hook in ${toolName}`);
  writeFileSync(hookPath, script, { encoding: 'utf-8' });
  chmodSync(hookPath, 0o755);
  console.log(`✅ Pre-push hook installed successfully at ${hookPath}`);
}
