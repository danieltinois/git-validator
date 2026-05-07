import { GitValidatorConfig } from '../config';
import { findClosest } from '../utils/similarity';
import { invalid, valid, ValidationResult } from './validation';

const TEMPORARY_COMMIT_PATTERN = /^(WIP|fixup!|squash!)/i;
const TEMPORARY_COMMIT_PREFIX_PATTERN = /^(WIP|fixup!|squash!):?\s*/i;
const BREAKING_CHANGE_PATTERN = /BREAKING CHANGE:/i;

function getCommitType(header: string): string {
  return header.split(':')[0].split('(')[0].replace('!', '').trim();
}

function getCommitSubject(header: string): string {
  return header.split(':').slice(1).join(':').trim();
}

export function validateCommitRules(
  message: string,
  config: GitValidatorConfig
): ValidationResult {
  const normalizedMessage = message.trim();
  const lines = normalizedMessage.split('\n');
  const header = lines[0];
  const body = lines.slice(1).join('\n');

  if (!header) {
    return invalid(
      'Commit message cannot be empty.',
      'feat: describe your change'
    );
  }

  if (TEMPORARY_COMMIT_PATTERN.test(header)) {
    const suggestion = header.replace(
      TEMPORARY_COMMIT_PREFIX_PATTERN,
      'feat: '
    );

    return invalid(
      'Temporary commits (WIP, fixup!, squash!) are not allowed.',
      suggestion
    );
  }

  const type = getCommitType(header);

  if (!header.includes(':')) {
    return invalid(
      'Missing type (e.g., feat, fix, chore, etc.)',
      `feat: ${header}`
    );
  }

  if (!config.commitTypes.includes(type)) {
    const closest = findClosest(type, config.commitTypes);
    const subject = getCommitSubject(header);

    return invalid(
      `Type "${type}" is not valid.\n   → Allowed types: ${config.commitTypes.join(
        ', '
      )}`,
      `${closest}: ${subject || 'describe your change'}`
    );
  }

  const subject = getCommitSubject(header);
  if (!subject) {
    return invalid(
      'Commit description cannot be empty.',
      `${type}: describe your change`
    );
  }

  if (subject.length > config.maxCommitLength) {
    return invalid(
      `Message too long (${subject.length} chars). Max allowed: ${config.maxCommitLength}`,
      `${type}: ${subject.slice(0, config.maxCommitLength)}...`
    );
  }

  if (BREAKING_CHANGE_PATTERN.test(body)) {
    return valid();
  }

  return valid();
}
