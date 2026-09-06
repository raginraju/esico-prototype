// tests/Card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/matchers';
import { CenteredLayout, AuthCard } from '../src/components/ui/Card';

describe('Card Components', () => {
  describe('CenteredLayout', () => {
    it('renders children content', () => {
      render(
        <CenteredLayout>
          <div>Centered Content</div>
        </CenteredLayout>
      );
      expect(screen.getByText('Centered Content')).toBeInTheDocument();
    });

    it('applies centering styles', () => {
      const { container } = render(
        <CenteredLayout>
          <div>Content</div>
        </CenteredLayout>
      );
      const layoutDiv = container.querySelector('.min-h-screen');
      expect(layoutDiv).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('applies background color styling', () => {
      const { container } = render(
        <CenteredLayout>
          <div>Content</div>
        </CenteredLayout>
      );
      const layoutDiv = container.firstChild;
      expect(layoutDiv).toHaveClass('bg-[#ede9f3]');
    });

    it('applies responsive padding', () => {
      const { container } = render(
        <CenteredLayout>
          <div>Content</div>
        </CenteredLayout>
      );
      const layoutDiv = container.firstChild;
      expect(layoutDiv).toHaveClass('p-4', 'sm:p-8');
    });

    it('supports multiple children', () => {
      render(
        <CenteredLayout>
          <div>Item 1</div>
          <div>Item 2</div>
        </CenteredLayout>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('AuthCard', () => {
    it('renders children content', () => {
      render(
        <AuthCard>
          <div>Auth Content</div>
        </AuthCard>
      );
      expect(screen.getByText('Auth Content')).toBeInTheDocument();
    });

    it('applies card styling classes', () => {
      const { container } = render(
        <AuthCard>
          <div>Card Content</div>
        </AuthCard>
      );
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveClass('w-full', 'max-w-[500px]', 'bg-white', 'rounded-[2px]', 'shadow-sm');
    });

    it('applies default padding', () => {
      const { container } = render(
        <AuthCard>
          <div>Content</div>
        </AuthCard>
      );
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveClass('p-8', 'sm:p-10');
    });

    it('accepts custom className prop', () => {
      const { container } = render(
        <AuthCard className="custom-auth-card">
          <div>Custom Card</div>
        </AuthCard>
      );
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveClass('custom-auth-card');
    });

    it('combines default and custom className', () => {
      const { container } = render(
        <AuthCard className="mt-4">
          <div>Combined Styles</div>
        </AuthCard>
      );
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveClass('w-full', 'mt-4');
    });

    it('supports multiple children', () => {
      render(
        <AuthCard>
          <h1>Title</h1>
          <p>Description</p>
          <button>Submit</button>
        </AuthCard>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    describe('Negative and Edge Cases', () => {
      it('renders with empty children', () => {
        const { container } = render(<AuthCard></AuthCard>);
        const cardDiv = container.firstChild;
        expect(cardDiv).toBeInTheDocument();
      });

      it('renders with null children', () => {
        const { container } = render(<AuthCard>{null}</AuthCard>);
        const cardDiv = container.firstChild;
        expect(cardDiv).toBeInTheDocument();
      });

      it('handles deeply nested children', () => {
        render(
          <AuthCard>
            <div>
              <div>
                <div>
                  <span>Deep Content</span>
                </div>
              </div>
            </div>
          </AuthCard>
        );
        expect(screen.getByText('Deep Content')).toBeInTheDocument();
      });

      it('CenteredLayout renders with null children', () => {
        const { container } = render(<CenteredLayout>{null}</CenteredLayout>);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('CenteredLayout renders with empty string children', () => {
        const { container } = render(<CenteredLayout>{''}</CenteredLayout>);
        const layoutDiv = container.firstChild;
        expect(layoutDiv).toBeInTheDocument();
      });

      it('AuthCard with empty className string', () => {
        const { container } = render(<AuthCard className="">Content</AuthCard>);
        const cardDiv = container.firstChild;
        expect(cardDiv).toHaveClass('w-full', 'max-w-[500px]');
      });

      it('AuthCard maintains max-width constraint with very long content', () => {
        const { container } = render(
          <AuthCard>
            <div style={{ width: '1000px' }}>Very Wide Content</div>
          </AuthCard>
        );
        const cardDiv = container.firstChild as HTMLElement;
        expect(cardDiv).toHaveClass('max-w-[500px]');
      });
    });
  });
});
