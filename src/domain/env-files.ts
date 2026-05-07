import { basename } from 'path';
import { GitValidatorConfig } from '../config';
import { invalid, valid, ValidationResult } from './validation';

function parseFileList(files: string | string[]): string[] {
  const values = Array.isArray(files) ? files : files.split(/\r?\n/);

  return values.map((file) => file.trim()).filter(Boolean);
}

function isEnvFile(filePath: string, allowedEnvFiles: string[]): boolean {
  const fileName = basename(filePath);

  if (allowedEnvFiles.includes(fileName)) {
    return false;
  }

  return fileName === '.env' || fileName.startsWith('.env.');
}

export function validateEnvFileRules(
  files: string | string[],
  config: GitValidatorConfig
): ValidationResult {
  const blockedFiles = parseFileList(files).filter((file) =>
    isEnvFile(file, config.allowedEnvFiles)
  );

  if (blockedFiles.length === 0) {
    return valid();
  }

  return invalid(
    `Do not commit environment files:\n   → ${blockedFiles.join('\n   → ')}`,
    'remove the .env file from the commit and keep only .env.example'
  );
}
