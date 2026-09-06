// tests/AdminHeader.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/matchers';
import AdminHeader from '../src/components/ui/AdminHeader';

describe('AdminHeader Component', () => {
  it('renders the company branding text on desktop viewports', () => {
    render(
      <BrowserRouter>
        <AdminHeader onToggleSidebar={vi.fn()} />
      </BrowserRouter>
    );

    const brandingElement = screen.getByText(/EMAAR SUPPORT INSPECTION COMPANY/i);
    expect(brandingElement).toBeInTheDocument();
  });

  it('triggers the toggle callback when the menu button is clicked', async () => {
    const handleToggle = vi.fn();
    render(
      <BrowserRouter>
        <AdminHeader onToggleSidebar={handleToggle} />
      </BrowserRouter>
    );

    // Target the hamburger button element
    const toggleButton = screen.getAllByRole('button')[0];
    
    // Simulate a user click
    await userEvent.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});