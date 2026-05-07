import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface GitValidatorConfig {
  commitTypes: string[];
  branchPrefixes: string[];
  maxCommitLength: number;
  allowedEnvFiles: string[];
}

type ConfigLogger = Pick<Console, 'warn'>;

interface LoadConfigOptions {
  cwd?: string;
  logger?: ConfigLogger;
}

export const CONFIG_FILE_NAME = '.gitvalidatorrc.json';

export const defaultConfig: GitValidatorConfig = {
  commitTypes: [
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'perf',
    'test',
    'build',
    'ci',
    'chore',
    'revert',
  ],
  branchPrefixes: ['feature', 'hotfix', 'release', 'bugfix', 'support'],
  maxCommitLength: 100,
  allowedEnvFiles: ['.env.example', '.env.sample', '.env.template'],
};

function normalizeStringList(
  value: unknown,
  fallback: string[]
): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const values = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : [...fallback];
}

function normalizeMaxCommitLength(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return defaultConfig.maxCommitLength;
  }

  return value;
}

export function mergeConfig(value: unknown): GitValidatorConfig {
  const input =
    value && typeof value === 'object'
      ? (value as Partial<GitValidatorConfig>)
      : {};

  return {
    commitTypes: normalizeStringList(
      input.commitTypes,
      defaultConfig.commitTypes
    ),
    branchPrefixes: normalizeStringList(
      input.branchPrefixes,
      defaultConfig.branchPrefixes
    ),
    maxCommitLength: normalizeMaxCommitLength(input.maxCommitLength),
    allowedEnvFiles: normalizeStringList(
      input.allowedEnvFiles,
      defaultConfig.allowedEnvFiles
    ),
  };
}

export function loadConfig(options: LoadConfigOptions = {}): GitValidatorConfig {
  const cwd = options.cwd ?? process.cwd();
  const logger = options.logger ?? console;
  const configPath = join(cwd, CONFIG_FILE_NAME);

  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return mergeConfig(parsed);
    } catch (error) {
      logger.warn(`Could not read ${CONFIG_FILE_NAME}. Using defaults.`, error);
    }
  }

  return mergeConfig({});
}
