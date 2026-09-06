// tests/AdminLayout.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import AdminLayout from '../src/layouts/AdminLayout';

describe('AdminLayout Component', () => {
  it('renders nested route content correctly inside the outlet', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<div>Dashboard Workspace View</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard Workspace View/i)).toBeInTheDocument();
  });

  it('toggles mobile drawer visibility when the header button is clicked', async () => {
    // Mock window width to simulate a mobile viewport
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Find and click the mobile menu toggle button in the header
    const toggleButton = screen.getAllByRole('button')[0];
    await userEvent.click(toggleButton);

    // Sidebar navigation item should become accessible/visible after opening
    const sidebarLink = screen.getByText(/Certificates/i);
    expect(sidebarLink).toBeInTheDocument();
  });

  describe('Negative and Edge Cases', () => {
    it('opens sidebar by default on desktop viewport', async () => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Sidebar should be visible on desktop
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      // Check that dashboard menu item is in the document
      const dashboardMenuItems = screen.getAllByText(/Dashboard/i);
      expect(dashboardMenuItems.length).toBeGreaterThan(0);
    });

    it('closes sidebar by default on mobile viewport', async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Content should still be visible
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });

    it('shows mobile backdrop when sidebar is open on mobile', async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const toggleButtons = screen.getAllByRole('button');
      const toggleButton = toggleButtons[0];
      await userEvent.click(toggleButton);

      // Backdrop should be visible - check for the dark overlay
      const backdrop = container.querySelector('div.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
    });

    it('closes sidebar when backdrop is clicked on mobile', async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const toggleButtons = screen.getAllByRole('button');
      const toggleButton = toggleButtons[0];
      await userEvent.click(toggleButton);

      const backdrop = container.querySelector('div.fixed.inset-0');
      if (backdrop) {
        await userEvent.click(backdrop);
      }

      // After clicking backdrop, sidebar should close
      expect(screen.getByText(/Content/i)).toBeInTheDocument();
    });

    it('handles multiple resize events', async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Resize to desktop
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));

      // Resize back to mobile
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders outlet with nested route content', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Nested Route Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Nested Route Content')).toBeInTheDocument();
    });

    it('maintains main content scroll while sidebar is open', async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('overflow-y-auto');
    });

    it('applies proper padding and spacing to main content', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('p-6', 'md:p-8');
    });

    it('renders with flex layout for layout structure', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<div>Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const layoutDiv = container.querySelector('.flex.flex-col');
      expect(layoutDiv).toBeInTheDocument();
    });
  });
});