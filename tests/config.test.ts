import { defaultConfig, mergeConfig } from '../src/config';

describe('Config', () => {
  it('should merge custom values with defaults', () => {
    const config = mergeConfig({
      commitTypes: ['feat', 'fix'],
      maxCommitLength: 72,
    });

    expect(config).toEqual({
      commitTypes: ['feat', 'fix'],
      branchPrefixes: defaultConfig.branchPrefixes,
      maxCommitLength: 72,
      allowedEnvFiles: defaultConfig.allowedEnvFiles,
    });
  });

  it('should ignore invalid custom values', () => {
    const config = mergeConfig({
      commitTypes: [],
      branchPrefixes: ['feature', '', 1],
      maxCommitLength: -1,
      allowedEnvFiles: [],
    });

    expect(config).toEqual({
      commitTypes: defaultConfig.commitTypes,
      branchPrefixes: ['feature'],
      maxCommitLength: defaultConfig.maxCommitLength,
      allowedEnvFiles: defaultConfig.allowedEnvFiles,
    });
  });
});
