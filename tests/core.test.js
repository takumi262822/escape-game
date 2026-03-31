/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { Validator } from '../src/utils/validator.js';
import { XSSProtection } from '../src/utils/xss.js';
import { CodeDefinitions } from '../src/constants/code-definitions.js';

test('Validator validates level shape', () => {
  const validLevel = { id: 'EASY', code: '742' };
  const invalidLevel = { id: 'EASY' };

  assert.equal(Validator.isValidLevel(validLevel), true);
  assert.equal(Validator.isValidLevel(invalidLevel), false);
});

test('XSSProtection sanitizes html special chars', () => {
  const raw = '<script>alert("x")</script>';
  const safe = XSSProtection.sanitize(raw);

  assert.equal(safe.includes('<script>'), false);
  assert.equal(safe.includes('&lt;script&gt;'), true);
});

test('CodeDefinitions returns level by difficulty key', () => {
  assert.equal(CodeDefinitions.getLevelByDifficulty('EASY')?.id, 'EASY');
  assert.equal(CodeDefinitions.getLevelByDifficulty('NORMAL')?.id, 'NORMAL');
  assert.equal(CodeDefinitions.getLevelByDifficulty('UNKNOWN'), null);
});
