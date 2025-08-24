import { validateCommitMessage } from '../src/validators/commit';

describe('Commit Validator', () => {
  it('should accept a valid commit', () => {
    expect(validateCommitMessage('feat: add login')).toBeNull();
  });

  it('should suggest correction for typo in type', () => {
    const result = validateCommitMessage('fiz: corrigir bug no login');
    expect(result).toContain('💡 Example: "fix: corrigir bug no login"');
  });

  it('should suggest correction for missing type', () => {
    const result = validateCommitMessage('corrigir bug no login');
    expect(result).toContain('💡 Example: "feat: corrigir bug no login"');
  });

  it('should block WIP commits', () => {
    const result = validateCommitMessage('WIP: implementando tela de login');
    expect(result).toContain('💡 Example: "feat: implementando tela de login"');
  });

  it('should block long messages', () => {
    const longMessage = 'feat: ' + 'a'.repeat(150);
    const result = validateCommitMessage(longMessage);
    expect(result).toContain('Message too long');
  });

  it('should allow BREAKING CHANGE in body', () => {
    const commit = `refactor(api): change user endpoint

BREAKING CHANGE: /users endpoint now requires authentication`;
    expect(validateCommitMessage(commit)).toBeNull();
  });
});
