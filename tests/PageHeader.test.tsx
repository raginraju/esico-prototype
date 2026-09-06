// tests/PageHeader.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/matchers';
import PageHeader from '../src/components/ui/PageHeader';

describe('PageHeader Component', () => {
  const mockIcon = <div data-testid="header-icon">📋</div>;

  it('renders the title', () => {
    render(<PageHeader title="Dashboard" icon={mockIcon} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(<PageHeader title="Test Page" icon={mockIcon} />);
    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
  });

  it('renders icon in a styled container', () => {
    const { container } = render(<PageHeader title="Test" icon={mockIcon} />);
    const iconContainer = container.querySelector('.w-\\[36px\\]');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('bg-gradient-to-r', 'rounded-[4px]', 'flex', 'items-center', 'justify-center');
  });

  it('renders with title and icon flexbox layout', () => {
    const { container } = render(<PageHeader title="Test Page" icon={mockIcon} />);
    const headerDiv = container.firstChild;
    expect(headerDiv).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('renders action button when actionButton prop is provided', () => {
    const handleClick = vi.fn();
    render(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'Add New', onClick: handleClick }}
      />
    );
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('calls onClick handler when action button is clicked', async () => {
    const handleClick = vi.fn();
    render(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'Create', onClick: handleClick }}
      />
    );
    
    await userEvent.click(screen.getByText('Create'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when actionButton prop is not provided', () => {
    const { queryByText } = render(<PageHeader title="Test" icon={mockIcon} />);
    expect(queryByText('Add New')).not.toBeInTheDocument();
  });

  it('applies correct styling to action button', () => {
    render(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'Action', onClick: vi.fn() }}
      />
    );
    const button = screen.getByText('Action');
    expect(button).toHaveClass('bg-gradient-to-r', 'text-white', 'text-[13px]', 'font-medium', 'rounded-[4px]');
  });

  it('renders title with proper heading styling', () => {
    render(<PageHeader title="Page Title" icon={mockIcon} />);
    const title = screen.getByText('Page Title');
    expect(title).toHaveClass('text-[17px]', 'font-bold', 'text-[#343a40]');
  });

  it('displays multiple action buttons (sequential renders)', () => {
    const { rerender } = render(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'First', onClick: vi.fn() }}
      />
    );
    expect(screen.getByText('First')).toBeInTheDocument();

    rerender(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'Second', onClick: vi.fn() }}
      />
    );
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('renders icon and title in correct layout order', () => {
    const { container } = render(<PageHeader title="Test" icon={mockIcon} />);
    const contentDiv = container.querySelector('.flex.items-center.gap-3');
    const children = contentDiv?.children;
    
    expect(children?.[0]).toHaveClass('flex', 'items-center', 'justify-center'); // Icon should be first
    expect(children?.[1]).toHaveClass('text-[17px]', 'font-bold'); // Title should be second
  });

  it('supports complex icon elements', () => {
    const complexIcon = (
      <svg data-testid="complex-icon">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
    render(<PageHeader title="SVG Test" icon={complexIcon} />);
    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
  });

  it('maintains proper gap between icon and title', () => {
    const { container } = render(<PageHeader title="Test" icon={mockIcon} />);
    const contentDiv = container.querySelector('.gap-3');
    expect(contentDiv).toBeInTheDocument();
  });

  it('applies hover effect to action button', () => {
    render(
      <PageHeader 
        title="Test" 
        icon={mockIcon}
        actionButton={{ label: 'Hover Me', onClick: vi.fn() }}
      />
    );
    const button = screen.getByText('Hover Me');
    expect(button).toHaveClass('hover:opacity-95', 'transition-opacity');
  });

  describe('Negative and Edge Cases', () => {
    it('renders with empty title string', () => {
      render(<PageHeader title="" icon={mockIcon} />);
      // Component should still render without error
      const { container } = render(<PageHeader title="" icon={mockIcon} />);
      expect(container).toBeInTheDocument();
    });

    it('handles very long title text', () => {
      const longTitle = 'This is an extremely long page title that goes on and on and should still render properly without breaking';
      render(<PageHeader title={longTitle} icon={mockIcon} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('renders with null icon gracefully', () => {
      render(<PageHeader title="Test" icon={null as any} />);
      const title = screen.getByText('Test');
      expect(title).toBeInTheDocument();
    });

    it('renders with undefined actionButton', () => {
      render(<PageHeader title="Test" icon={mockIcon} actionButton={undefined} />);
      expect(screen.queryByRole('button', { name: /Add|Create|Action/ })).not.toBeInTheDocument();
    });

    it('handles actionButton with empty label', () => {
      const handleClick = vi.fn();
      render(
        <PageHeader 
          title="Test" 
          icon={mockIcon}
          actionButton={{ label: '', onClick: handleClick }}
        />
      );
      // Button should still exist even with empty label
      const button = screen.getAllByRole('button').find(btn => btn.textContent === '');
      expect(button).toBeInTheDocument();
    });

    it('handles null onClick handler in actionButton', async () => {
      render(
        <PageHeader 
          title="Test" 
          icon={mockIcon}
          actionButton={{ label: 'Click', onClick: null as any }}
        />
      );
      const button = screen.getByText('Click');
      await userEvent.click(button);
      // Should not throw error
      expect(button).toBeInTheDocument();
    });

    it('handles rapid onClick calls on action button', async () => {
      const handleClick = vi.fn();
      render(
        <PageHeader 
          title="Test" 
          icon={mockIcon}
          actionButton={{ label: 'Rapid Click', onClick: handleClick }}
        />
      );
      const button = screen.getByText('Rapid Click');
      
      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('renders icon as empty div', () => {
      const emptyIcon = <div data-testid="empty-icon"></div>;
      render(<PageHeader title="Test" icon={emptyIcon} />);
      expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    });

    it('renders title with special HTML characters', () => {
      const titleWithChars = 'Title & <special> "characters"';
      render(<PageHeader title={titleWithChars} icon={mockIcon} />);
      // Text should be safely escaped and rendered
      expect(screen.getByText(titleWithChars)).toBeInTheDocument();
    });

    it('handles actionButton with very long label text', () => {
      const longLabel = 'This is a very long button label that contains lots of text';
      const handleClick = vi.fn();
      render(
        <PageHeader 
          title="Test" 
          icon={mockIcon}
          actionButton={{ label: longLabel, onClick: handleClick }}
        />
      );
      const button = screen.getByText(longLabel);
      expect(button).toBeInTheDocument();
    });

    it('maintains layout with missing optional actionButton', () => {
      const { container } = render(<PageHeader title="Test" icon={mockIcon} />);
      const headerDiv = container.firstChild;
      expect(headerDiv).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('renders correctly when title updates', () => {
      const { rerender } = render(<PageHeader title="Initial" icon={mockIcon} />);
      expect(screen.getByText('Initial')).toBeInTheDocument();
      
      rerender(<PageHeader title="Updated" icon={mockIcon} />);
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });
});
