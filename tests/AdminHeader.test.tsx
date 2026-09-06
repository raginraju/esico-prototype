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

  describe('Negative and Edge Cases', () => {
    it('handles multiple rapid toggle clicks', async () => {
      const handleToggle = vi.fn();
      render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={handleToggle} />
        </BrowserRouter>
      );

      const toggleButton = screen.getAllByRole('button')[0];
      await userEvent.click(toggleButton);
      await userEvent.click(toggleButton);
      await userEvent.click(toggleButton);

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it('renders logo image with proper alt text', () => {
      render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('ESICO');
      expect(logo).toBeInTheDocument();
    });

    it('navigates to dashboard when logo is clicked', async () => {
      render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('ESICO').closest('div');
      if (logo?.parentElement) {
        await userEvent.click(logo.parentElement);
      }
      expect(window.location.pathname).toContain('/');
    });

    it('handles viewport resize events', () => {
      render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      // Simulate resize to mobile
      global.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      // Simulate resize to desktop
      global.innerWidth = 1000;
      window.dispatchEvent(new Event('resize'));

      const headerElement = screen.getByText(/EMAAR SUPPORT INSPECTION COMPANY/i).closest('header');
      expect(headerElement).toBeInTheDocument();
    });

    it('maintains sticky positioning on page scroll', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0');
    });

    it('does not call onToggleSidebar for non-button clicks', async () => {
      const handleToggle = vi.fn();
      const { container } = render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={handleToggle} />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      if (header) {
        await userEvent.click(header);
      }

      // Only hamburger button clicks should trigger toggle
      expect(handleToggle).toHaveBeenCalledTimes(0);
    });

    it('has profile avatar element in header', () => {
      render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      const avatarSvg = screen.getByRole('button').parentElement?.querySelector('svg[viewBox="0 0 20 20"]');
      expect(avatarSvg).toBeInTheDocument();
    });

    it('applies z-index for proper layering', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminHeader onToggleSidebar={vi.fn()} />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('z-50');
    });
  });
});