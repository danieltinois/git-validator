import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface GitValidatorConfig {
  commitTypes: string[];
  branchPrefixes: string[];
  maxCommitLength: number;
}

const defaultConfig: GitValidatorConfig = {
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
};

export function loadConfig(): GitValidatorConfig {
  const configPath = join(process.cwd(), '.gitvalidatorrc.json');

  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...defaultConfig, ...parsed };
    } catch (error) {
      console.error('Error reading .gitvalidatorrc.json:', error);
    }
  }
  return defaultConfig;
}
