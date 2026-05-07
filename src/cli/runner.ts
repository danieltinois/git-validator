import { validateBranchName } from '../validators/branch';
import { validateCommitMessage } from '../validators/commit';
import { validateCommittedFiles } from '../validators/env-files';
import { installPrePushHook } from './hook';

type Command = 'init' | 'commit' | 'branch' | 'files';

export const USAGE = `Usage:
  git-validator init
  git-validator commit "feat: add login"
  git-validator branch "feature/new-feature"
  git-validator files ".env.local"`;

function exitWithError(message: string): never {
  console.error(message);
  process.exit(1);
}

function runValidation(
  value: string | undefined,
  validator: (input: string) => string | null,
  successMessage: string
): void {
  if (!value) {
    exitWithError(USAGE);
  }

  const error = validator(value);

  if (error) {
    exitWithError(error);
  }

  console.log(successMessage);
}

export function run(command: string | undefined, value: string | undefined): void {
  switch (command as Command | undefined) {
    case 'init':
      try {
        installPrePushHook();
      } catch (error) {
        exitWithError(`❌ Error installing hook: ${error}`);
      }
      return;

    case 'commit':
      runValidation(value, validateCommitMessage, '✅ Valid commit!');
      return;

    case 'branch':
      runValidation(value?.trim(), validateBranchName, '✅ Valid branch!');
      return;

    case 'files':
      runValidation(value, validateCommittedFiles, '✅ Valid files!');
      return;

    default:
      exitWithError(USAGE);
  }
}
