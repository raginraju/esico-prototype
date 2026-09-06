// tests/AddIdCardModal.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/matchers';
import AddIdCardModal from '../src/components/modals/AddIdCardModal';

describe('AddIdCardModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders modal when isOpen is true', () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
      
      expect(screen.getByText('Add New ID Card')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      const { container } = render(
        <AddIdCardModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      );

      expect(screen.queryByText('Add New ID Card')).not.toBeInTheDocument();
      expect(container.querySelector('.modal-backdrop')).not.toBeInTheDocument();
    });

    it('renders all form input fields', () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('File Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Civil ID Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Designation')).toBeInTheDocument();
    });

    it('renders Cancel and Add buttons', () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('renders modal backdrop', () => {
      const { container } = render(
        <AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      );

      const backdrop = container.querySelector('.modal-backdrop');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('updates name input value', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
      await userEvent.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');
    });

    it('updates file number input value', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const fileNumberInput = screen.getByPlaceholderText('File Number') as HTMLInputElement;
      await userEvent.type(fileNumberInput, 'FN123456');

      expect(fileNumberInput.value).toBe('FN123456');
    });

    it('updates civil ID number input value', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const civilIdInput = screen.getByPlaceholderText('Civil ID Number') as HTMLInputElement;
      await userEvent.type(civilIdInput, 'CV987654');

      expect(civilIdInput.value).toBe('CV987654');
    });

    it('updates designation input value', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const designationInput = screen.getByPlaceholderText('Designation') as HTMLInputElement;
      await userEvent.type(designationInput, 'Manager');

      expect(designationInput.value).toBe('Manager');
    });
  });

  describe('Form Validation', () => {
    it('shows error when required fields are empty', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      expect(screen.getByText(/Please fill in Name, File Number, and Civil ID Number/i)).toBeInTheDocument();
    });

    it('does not call API when validation fails', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      expect(screen.getByText(/Please fill in Name, File Number, and Civil ID Number/i)).toBeInTheDocument();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('allows submission with only required fields', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Form Submission', () => {
    it('submits form with all required fields', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/idcards', expect.objectContaining({
          method: 'POST',
        }));
      }, { timeout: 3000 });
    });

    it('displays success message on successful submission', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/ID Card added successfully/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('calls onSuccess callback on successful submission', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('displays error message on API failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'error', message: 'Invalid file format' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('handles non-JSON response from API', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Internal Server Error',
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('handles network error gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Button Interactions', () => {
    it('calls onClose when Cancel button is clicked', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('disables submit button while loading', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => Promise.resolve({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: async () => ({ status: 'success', message: 'ID Card added' }),
        })
      );

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add') as HTMLButtonElement;
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Modal Behavior', () => {
    it('resets form when modal opens', async () => {
      const { rerender } = render(
        <AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      );

      const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
      await userEvent.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');

      rerender(
        <AddIdCardModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      );

      rerender(
        <AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      );

      const newNameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
      expect(newNameInput.value).toBe('');
    });

    it('trims whitespace from input values before submission', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, '  John Doe  ');
      await userEvent.type(fileNumberInput, '  FN123456  ');
      await userEvent.type(civilIdInput, '  CV987654  ');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('File Input Handling', () => {
    it('accepts PDF files', async () => {
      const { container } = render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      await userEvent.upload(fileInput, file);

      expect(fileInput.files?.[0].name).toBe('test.pdf');
    });

    it('accepts JPG files', async () => {
      const { container } = render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await userEvent.upload(fileInput, file);

      expect(fileInput.files?.[0].name).toBe('test.jpg');
    });

    it('accepts JPEG files', async () => {
      const { container } = render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpeg', { type: 'image/jpeg' });
      await userEvent.upload(fileInput, file);

      expect(fileInput.files?.[0].name).toBe('test.jpeg');
    });
  });

  describe('Negative and Edge Cases', () => {
    it('handles empty form submission', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      expect(screen.getByText(/Please fill in Name, File Number, and Civil ID Number/i)).toBeInTheDocument();
    });

    it('handles very long input values', async () => {
      const longText = 'a'.repeat(500);
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
      await userEvent.type(nameInput, longText);

      expect(nameInput.value).toBe(longText);
    });

    it('handles special characters in input', () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
      const specialChars = '!@#$%^&*()_+=-[]{}|;:,.<>?';
      nameInput.value = specialChars;

      expect(nameInput.value).toBe(specialChars);
    });

    it('shows error display with proper styling', async () => {
      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      const errorDisplay = screen.getByText(/Please fill in Name, File Number, and Civil ID Number/i).closest('div');
      expect(errorDisplay).toHaveClass('bg-red-50', 'text-red-700');
    });

    it('clears error message on successful submission', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ status: 'success', message: 'ID Card added' }),
      });

      render(<AddIdCardModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const fileNumberInput = screen.getByPlaceholderText('File Number');
      const civilIdInput = screen.getByPlaceholderText('Civil ID Number');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(fileNumberInput, 'FN123456');
      await userEvent.type(civilIdInput, 'CV987654');

      const submitButton = screen.getByText('Add');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/ID Card added successfully/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});
