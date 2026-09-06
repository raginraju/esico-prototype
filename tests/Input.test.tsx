// tests/Input.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/matchers';
import { Input } from '../src/components/ui/Input';

describe('Input Component', () => {
  it('renders input element', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('renders with label when label prop is provided', () => {
    render(<Input label="Email Address" id="email" />);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('associates label with input using id', () => {
    render(<Input label="Username" id="username" />);
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', 'username');
  });

  it('does not render label when label prop is not provided', () => {
    const { container } = render(<Input id="test" />);
    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Password" error="Password is required" id="password" />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(<Input error="Invalid input" id="test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('accepts user input', async () => {
    const { container } = render(<Input id="test" />);
    const input = container.querySelector('input') as HTMLInputElement;
    
    await userEvent.type(input, 'test value');
    expect(input.value).toBe('test value');
  });

  it('supports placeholder text', () => {
    const { container } = render(<Input placeholder="Enter text..." id="test" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter text...');
  });

  it('supports type attribute', () => {
    const { container } = render(<Input type="email" id="email" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('applies custom className along with default styles', () => {
    const { container } = render(<Input className="custom-input" id="test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-input', 'w-full', 'px-3.5');
  });

  it('supports disabled state', () => {
    const { container } = render(<Input disabled id="test" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('supports readonly state', () => {
    const { container } = render(<Input readOnly id="test" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('has proper focus styling classes', () => {
    const { container } = render(<Input id="test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('focus:outline-none', 'focus:border-neutral-400', 'focus:ring-1');
  });

  it('renders label and input together with error', () => {
    render(<Input label="Email" error="Invalid email" id="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('supports value prop', async () => {
    const { container, rerender } = render(<Input value="initial" readOnly id="test" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });

  it('applies placeholder styling class', () => {
    const { container } = render(<Input placeholder="Type here..." id="test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('placeholder-[#a6abb7]');
  });

  describe('Negative and Edge Cases', () => {
    it('handles very long input value', async () => {
      const longValue = 'a'.repeat(1000);
      const { container } = render(<Input defaultValue={longValue} id="test" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe(longValue);
    });

    it('handles special characters in input', async () => {
      const { container } = render(<Input id="test" />);
      const input = container.querySelector('input') as HTMLInputElement;
      
      await userEvent.type(input, '<script>alert("xss")</script>');
      expect(input.value).toBe('<script>alert("xss")</script>');
    });

    it('renders with empty label prop', () => {
      render(<Input label="" id="test" />);
      // Empty label should not render as a visible label
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders with empty error message', () => {
      render(<Input error="" id="test" />);
      // Empty error should not render error styling
      const { container } = render(<Input error="" id="test" />);
      const input = container.querySelector('input');
      expect(input).not.toHaveClass('border-red-500');
    });

    it('does not render error styling without error prop', () => {
      const { container } = render(<Input id="test" />);
      const input = container.querySelector('input');
      expect(input).not.toHaveClass('border-red-500');
    });

    it('handles null value gracefully', () => {
      const { container } = render(<Input value={null as any} id="test" />);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('handles undefined placeholder', () => {
      const { container } = render(<Input placeholder={undefined} id="test" />);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('renders with multiple error messages (only shows last one)', () => {
      const { rerender } = render(<Input error="Error 1" id="test" />);
      expect(screen.getByText('Error 1')).toBeInTheDocument();
      
      rerender(<Input error="Error 2" id="test" />);
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });

    it('handles input with both error and disabled state', () => {
      const { container } = render(<Input error="Invalid" disabled id="test" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(input).toHaveClass('border-red-500');
    });

    it('preserves error styling through focus/blur cycles', async () => {
      const { container } = render(<Input error="Required" id="test" />);
      const input = container.querySelector('input') as HTMLInputElement;
      
      await userEvent.click(input);
      expect(input).toHaveClass('border-red-500');
      
      await userEvent.tab();
      expect(input).toHaveClass('border-red-500');
    });

    it('handles whitespace-only value', async () => {
      const { container } = render(<Input id="test" />);
      const input = container.querySelector('input') as HTMLInputElement;
      
      await userEvent.type(input, '   ');
      expect(input.value).toBe('   ');
    });
  });
});
