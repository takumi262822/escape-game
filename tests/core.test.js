/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { Validator } from '../src/utils/validator.js';
import { XSSProtection } from '../src/utils/xss.js';
import { CodeDefinitions } from '../src/constants/code-definitions.js';

// ステージ定義が必要なプロパティを満たしているかを確認する。
test('レベル定義が進行に必要な必須プロパティを満たすこと', () => {
  const validLevel = { id: 'EASY', code: '742' };
  const invalidLevel = { id: 'EASY' };

  assert.equal(Validator.isValidLevel(validLevel), true);
  assert.equal(Validator.isValidLevel(invalidLevel), false);
});

// 危険なHTML文字列がエスケープされて安全な表示用文字列になるかを確認する。
test('危険な HTML 文字列が安全な表示用文字列へ変換されること', () => {
  const raw = '<script>alert("x")</script>';
  const safe = XSSProtection.sanitize(raw);

  assert.equal(safe.includes('<script>'), false);
  assert.equal(safe.includes('&lt;script&gt;'), true);
});

// 難易度キーから対応するレベル定義を取得でき、不明キーではnullを返すかを確認する。
test('難易度キーから対応するレベル定義を取得できること', () => {
  assert.equal(CodeDefinitions.getLevelByDifficulty('EASY')?.id, 'EASY');
  assert.equal(CodeDefinitions.getLevelByDifficulty('NORMAL')?.id, 'NORMAL');
  assert.equal(CodeDefinitions.getLevelByDifficulty('UNKNOWN'), null);
});
