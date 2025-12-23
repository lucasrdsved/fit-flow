import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrainerStudents from './Students';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock the hooks
vi.mock('@/hooks/useTrainerData', () => ({
  useTrainerStudents: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    Plus: () => <span data-testid="icon-plus" />,
    Search: () => <span data-testid="icon-search" />,
    Filter: () => <span data-testid="icon-filter" />,
  };
});

import { useTrainerStudents } from '@/hooks/useTrainerData';
import { useAuth } from '@/contexts/AuthContext';

describe('TrainerStudents Filter Bug', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useAuth as any).mockReturnValue({
      userType: 'personal',
    });

    (useTrainerStudents as any).mockReturnValue({
      data: [
        { id: '1', name: 'Student 1', email: 's1@example.com', created_at: '2023-01-01' },
        { id: '2', name: 'Student 2', email: 's2@example.com', created_at: '2023-01-02' },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('should filter students when filter buttons are clicked', async () => {
    render(
      <BrowserRouter>
        <TrainerStudents />
      </BrowserRouter>,
    );

    // Initial state: 2 students shown
    expect(screen.getByText('Student 1')).toBeInTheDocument();
    expect(screen.getByText('Student 2')).toBeInTheDocument();

    // Click "Inativos"
    // Since we don't have "active" field in data, we assume "Inativos" should show nothing
    // (or only those marked inactive if we had them).
    // BUT the bug is that it IGNORES the filter, so it will still show everything.

    const inactiveButton = screen.getByText('Inativos');
    fireEvent.click(inactiveButton);

    // Verify the bug: Students are STILL visible despite filtering for Inactive (and having no inactive students)
    // If the filter worked (assuming default is active), these should disappear.
    // If the bug exists, they remain.

    // We expect them to be IN THE DOCUMENT for the test to pass BEFORE fix (verifying bug presence).
    // Wait, the prompt says: "Write a new test case that specifically fails before your fix and passes after it"

    // So I should assert the CORRECT behavior.
    // Correct behavior: Students should disappear when clicking "Inativos" (since none are inactive).

    // This expectation should FAIL now.
    expect(screen.queryByText('Student 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Student 2')).not.toBeInTheDocument();
  });
});
