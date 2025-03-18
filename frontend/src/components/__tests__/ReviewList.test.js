import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ReviewList from '../../components/ReviewList';
import api from '../../api/api';

// Mock the axios module
jest.mock('../../api/axios');

describe('ReviewList Component', () => {
  const mockReviews = [
    {
      _id: 'review1',
      rating: 4,
      content: 'Great service!',
      source: 'Google',
      reviewer: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      date: '2023-05-15T10:30:00Z',
      status: 'published'
    },
    {
      _id: 'review2',
      rating: 2,
      content: 'Could be better',
      source: 'Yelp',
      reviewer: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      date: '2023-05-10T14:20:00Z',
      status: 'published'
    }
  ];

  const mockBusinessId = 'business123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    api.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves to simulate loading
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
  });

  test('renders reviews when data is loaded', async () => {
    api.get.mockResolvedValueOnce({ data: mockReviews });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
    
    // Check if both reviews are rendered
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByText('Could be better')).toBeInTheDocument();
    
    // Check if reviewer names are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Check if sources are displayed
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Yelp')).toBeInTheDocument();
    
    // Check if ratings are displayed
    expect(screen.getAllByTestId('star-rating')).toHaveLength(2);
  });

  test('renders empty state when no reviews are available', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the empty state message
    await waitFor(() => {
      expect(screen.getByText(/No reviews found/i)).toBeInTheDocument();
    });
  });

  test('handles error when fetching reviews fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch reviews'));
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading reviews/i)).toBeInTheDocument();
    });
  });

  test('filters reviews by rating', async () => {
    api.get.mockResolvedValueOnce({ data: mockReviews });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
    
    // Filter by high rating (4-5 stars)
    const filterSelect = screen.getByLabelText(/Filter by rating/i);
    fireEvent.change(filterSelect, { target: { value: 'high' } });
    
    // Only the 4-star review should be visible
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.queryByText('Could be better')).not.toBeInTheDocument();
    
    // Filter by low rating (1-3 stars)
    fireEvent.change(filterSelect, { target: { value: 'low' } });
    
    // Only the 2-star review should be visible
    expect(screen.queryByText('Great service!')).not.toBeInTheDocument();
    expect(screen.getByText('Could be better')).toBeInTheDocument();
    
    // Reset filter to show all reviews
    fireEvent.change(filterSelect, { target: { value: 'all' } });
    
    // Both reviews should be visible again
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByText('Could be better')).toBeInTheDocument();
  });

  test('sorts reviews by date', async () => {
    api.get.mockResolvedValueOnce({ data: mockReviews });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ReviewList businessId={mockBusinessId} />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
    
    // Sort by oldest first
    const sortSelect = screen.getByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    
    // Check the order of reviews (this is a simplified check)
    const reviewElements = screen.getAllByTestId('review-item');
    expect(reviewElements[0]).toHaveTextContent('Could be better');
    expect(reviewElements[1]).toHaveTextContent('Great service!');
    
    // Sort by newest first (default)
    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    
    // Check the order of reviews again
    const updatedReviewElements = screen.getAllByTestId('review-item');
    expect(updatedReviewElements[0]).toHaveTextContent('Great service!');
    expect(updatedReviewElements[1]).toHaveTextContent('Could be better');
  });
}); 