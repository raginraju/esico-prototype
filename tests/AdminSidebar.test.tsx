// tests/AdminSidebar.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/matchers';
import AdminSidebar from '../src/components/ui/AdminSidebar';

describe('AdminSidebar Component', () => {
  it('renders all primary navigation items', () => {
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} isMobile={false} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/ID Cards/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificates/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('triggers onClose when a navigation item is clicked on mobile', async () => {
    const handleClose = vi.fn();
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} isMobile={true} onClose={handleClose} />
      </BrowserRouter>
    );

    const dashboardButton = screen.getByText(/Dashboard/i);
    await userEvent.click(dashboardButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});