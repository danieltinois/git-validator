import { validateBranchName } from '../src/validators/branch';

describe('Branch Validator', () => {
  it('should accept a valid branch', () => {
    expect(validateBranchName('feature/login')).toBeNull();
  });

  it('should suggest correction for typo in prefix', () => {
    const result = validateBranchName('featuree/login');
    expect(result).toContain('💡 Example: "feature/login"');
  });

  it('should suggest correction for wrong prefix', () => {
    const result = validateBranchName('bug/login');
    expect(result).toContain('💡 Example: "bugfix/login"');
  });

  it('should suggest feature/ if no prefix', () => {
    const result = validateBranchName('login');
    expect(result).toContain('💡 Example: "feature/login"');
  });

  it('should block empty branch name', () => {
    const result = validateBranchName('feature/');
    expect(result).toContain('Branch name cannot be empty');
  });

  it('should replace invalid characters', () => {
    const result = validateBranchName('feature/teste com espaço');
    expect(result).toContain('💡 Example: "feature/teste-com-espaço"');
  });
});
