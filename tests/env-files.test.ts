import { validateCommittedFiles } from '../src/validators/env-files';

describe('Environment Files Validator', () => {
  it('should accept regular files', () => {
    expect(validateCommittedFiles(['src/index.ts', 'README.md'])).toBeNull();
  });

  it('should block .env files', () => {
    const result = validateCommittedFiles(['src/index.ts', '.env']);

    expect(result).toContain('Do not commit environment files');
    expect(result).toContain('.env');
  });

  it('should block nested .env files', () => {
    const result = validateCommittedFiles('apps/api/.env.production');

    expect(result).toContain('apps/api/.env.production');
  });

  it('should allow environment examples by default', () => {
    expect(
      validateCommittedFiles(['.env.example', 'apps/api/.env.sample'])
    ).toBeNull();
  });

  it('should use custom allowed environment files', () => {
    expect(
      validateCommittedFiles('apps/api/.env.local.example', {
        commitTypes: ['feat'],
        branchPrefixes: ['feature'],
        maxCommitLength: 100,
        allowedEnvFiles: ['.env.local.example'],
      })
    ).toBeNull();
  });
});
