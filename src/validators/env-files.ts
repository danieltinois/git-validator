import { GitValidatorConfig, loadConfig } from '../config';
import { validateEnvFileRules } from '../domain/env-files';
import { formatValidationResult } from '../formatters/validation-message';

export function validateCommittedFiles(
  files: string | string[],
  config: GitValidatorConfig = loadConfig()
): string | null {
  const result = validateEnvFileRules(files, config);

  return formatValidationResult('files', 'commit file list', result);
}
