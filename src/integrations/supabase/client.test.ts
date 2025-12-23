import { describe, it, expect, vi } from 'vitest';

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
}));

// Import after mocking env
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

describe('Supabase Client', () => {
  it('should be initialized', () => {
    const supabase = createClient<Database>('https://test.supabase.co', 'test-key');
    expect(supabase).toBeDefined();
  });
});
