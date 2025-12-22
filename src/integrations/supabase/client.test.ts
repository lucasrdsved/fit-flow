import { describe, it, expect } from 'vitest';
import { supabase } from './client';

describe('Supabase Client', () => {
  it('should be initialized', () => {
    expect(supabase).toBeDefined();
  });
});
