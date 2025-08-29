import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRoomId } from '../../src/utils/generateRoomId';

describe('generateRoomId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a string of exactly 6 digits', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.123456);
    const id = generateRoomId();
    expect(id).toMatch(/^\d{6}$/);
  });
});
