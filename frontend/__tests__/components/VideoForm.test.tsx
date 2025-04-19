import { render, screen, fireEvent } from '@testing-library/react';
import { VideoForm } from '@/components/VideoForm';

// Mock the extractVideoId function from utils/youtube
jest.mock('@/utils/youtube', () => ({
  extractVideoId: (url: string) => {
    if (url.includes('valid-id')) return 'valid-id';
    return null;
  },
}));

describe('VideoForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders correctly', () => {
    render(<VideoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/youtube video url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /summarize video/i })).toBeInTheDocument();
  });

  it('calls onSubmit with valid video ID', () => {
    render(<VideoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/youtube video url/i);
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=valid-id' } });

    const submitButton = screen.getByRole('button', { name: /summarize video/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith('valid-id');
  });

  it('shows error for invalid YouTube URL', () => {
    render(<VideoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/youtube video url/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    const submitButton = screen.getByRole('button', { name: /summarize video/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/invalid youtube url/i)).toBeInTheDocument();
  });
});
