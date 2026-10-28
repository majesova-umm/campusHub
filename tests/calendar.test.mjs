import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthDays, dateKey } from '../src/lib/calendar.ts';

test('calendario comienza en lunes e incluye meses bisiestos y cambio de año', () => {
  const february = monthDays(2028, 1);
  assert.equal(february[0], null);
  assert.equal(february[1], '2028-02-01');
  assert.equal(february.at(-1), '2028-02-29');
  assert.equal(monthDays(2026, 1).filter(Boolean).length, 28);
  assert.equal(monthDays(2026, 11).at(-1), '2026-12-31');
  assert.equal(monthDays(2027, 0).find(Boolean), '2027-01-01');
  assert.equal(dateKey(new Date(2026, 9, 28)), '2026-10-28');
});
