import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders children correctly', () => {
    render(
      <AuthLayout title="Test Title" description="Test Description">
        <div>Child Content</div>
      </AuthLayout>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
