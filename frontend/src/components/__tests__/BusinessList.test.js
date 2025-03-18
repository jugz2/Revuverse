import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import BusinessList from '../../pages/dashboard/BusinessList';
import api from '../../api/api';

// Mock the axios module
jest.mock('../../api/axios');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('BusinessList Component', () => {
  const mockBusinesses = [
    {
      _id: '1',
      name: 'Test Business 1',
      category: 'Restaurant',
      address: '123 Test St',
      reviewCount: 10,
      averageRating: 4.5
    },
    {
      _id: '2',
      name: 'Test Business 2',
      category: 'Retail',
      address: '456 Test Ave',
      reviewCount: 5,
      averageRating: 3.8
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    api.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves to simulate loading
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BusinessList />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders businesses when data is loaded', async () => {
    api.get.mockResolvedValueOnce({ data: mockBusinesses });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BusinessList />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the businesses to load
    await waitFor(() => {
      expect(screen.getByText('Test Business 1')).toBeInTheDocument();
    });
    
    // Check if both businesses are rendered
    expect(screen.getByText('Test Business 1')).toBeInTheDocument();
    expect(screen.getByText('Test Business 2')).toBeInTheDocument();
    
    // Check if categories are displayed
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();
    
    // Check if addresses are displayed
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('456 Test Ave')).toBeInTheDocument();
    
    // Check if review counts are displayed
    expect(screen.getByText('10 Reviews')).toBeInTheDocument();
    expect(screen.getByText('5 Reviews')).toBeInTheDocument();
    
    // Check if ratings are displayed
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('3.8')).toBeInTheDocument();
  });

  test('renders empty state when no businesses are available', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BusinessList />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the empty state message
    await waitFor(() => {
      expect(screen.getByText(/No businesses found/i)).toBeInTheDocument();
    });
    
    // Check if the add business button is displayed
    expect(screen.getByText(/Add Your First Business/i)).toBeInTheDocument();
  });

  test('handles error when fetching businesses fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch businesses'));
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BusinessList />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading businesses/i)).toBeInTheDocument();
    });
  });

  test('opens delete confirmation modal when delete button is clicked', async () => {
    api.get.mockResolvedValueOnce({ data: mockBusinesses });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BusinessList />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for the businesses to load
    await waitFor(() => {
      expect(screen.getByText('Test Business 1')).toBeInTheDocument();
    });
    
    // Find and click the delete button for the first business
    const deleteButtons = screen.getAllByRole('button');
    const trashButtons = deleteButtons.filter(button => 
      button.innerHTML.includes('m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0')
    );
    fireEvent.click(trashButtons[0]);
    
    // Check if the confirmation modal is displayed
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    });
  });
}); 