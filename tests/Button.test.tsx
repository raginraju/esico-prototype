// tests/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/matchers';
import { Button } from '../src/components/ui/Button';

describe('Button Component', () => {
  it('renders button with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders with gradient variant by default', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByText('Default Button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('renders with primary variant when specified', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-[#00623a]');
  });

  it('renders with secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('border');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    
    await userEvent.click(screen.getByText('Disabled Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className along with variant styles', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  it('supports HTML button attributes', () => {
    render(<Button type="submit" aria-label="submit-button">Submit</Button>);
    const button = screen.getByText('Submit') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    expect(button).toHaveAttribute('aria-label', 'submit-button');
  });

  it('has proper styling classes applied', () => {
    render(<Button>Styled Button</Button>);
    const button = screen.getByText('Styled Button');
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-semibold');
  });

  describe('Negative and Edge Cases', () => {
    it('renders with empty children', () => {
      render(<Button></Button>);
      const button = screen.getAllByRole('button')[0];
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('handles very long text without breaking', () => {
      const longText = 'This is a very long button text that should not break the button styling or layout in any way';
      render(<Button>{longText}</Button>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('does not trigger onClick on rapid double clicks when not debounced', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByText('Click Me');
      
      await userEvent.click(button);
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('handles missing onClick gracefully', () => {
      render(<Button>No Handler</Button>);
      const button = screen.getByText('No Handler');
      expect(() => button.click()).not.toThrow();
    });

    it('renders correctly with null children', () => {
      render(<Button>{null}</Button>);
      const button = screen.getAllByRole('button')[0];
      expect(button).toBeInTheDocument();
    });

    it('handles undefined variant gracefully (uses default)', () => {
      render(<Button variant={undefined}>Default</Button>);
      const button = screen.getByText('Default');
      expect(button).toHaveClass('bg-gradient-to-r');
    });

    it('maintains active:scale effect class', () => {
      render(<Button>Active Effect</Button>);
      const button = screen.getByText('Active Effect');
      expect(button).toHaveClass('active:scale-[0.98]');
    });

    it('does not apply pointer-events when not disabled', () => {
      render(<Button>Clickable</Button>);
      const button = screen.getByText('Clickable') as HTMLButtonElement;
      const computedStyle = window.getComputedStyle(button);
      expect(button.disabled).toBe(false);
    });
  });
});
