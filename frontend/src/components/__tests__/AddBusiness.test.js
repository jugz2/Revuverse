import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AddBusiness from '../../pages/dashboard/AddBusiness';
import api from '../../api/api';

// Mock the axios module
jest.mock('../../api/axios');

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddBusiness Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AddBusiness />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if the form elements are rendered
    expect(screen.getByText('Add New Business')).toBeInTheDocument();
    expect(screen.getByLabelText(/Business Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Business Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Business/i })).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    const mockBusinessData = {
      name: 'New Test Business',
      category: 'Restaurant',
      address: '123 New St',
      phone: '123-456-7890',
      email: 'new@example.com',
      website: 'https://newbusiness.com',
      description: 'A new test business'
    };
    
    const mockResponse = {
      data: {
        _id: 'new-id',
        ...mockBusinessData
      }
    };
    
    api.post.mockResolvedValueOnce(mockResponse);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <AddBusiness />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Business Name/i), { target: { value: mockBusinessData.name } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: mockBusinessData.category } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: mockBusinessData.address } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: mockBusinessData.phone } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: mockBusinessData.email } });
    fireEvent.change(screen.getByLabelText(/Website/i), { target: { value: mockBusinessData.website } });
    fireEvent.change(screen.getByLabelText(/Business Description/i), { target: { value: mockBusinessData.description } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Business/i }));
    
    // Check if the API was called with the correct data
    expect(api.post).toHaveBeenCalledWith('/api/business', mockBusinessData);
    
    // Wait for the navigation to happen
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/businesses/new-id');
    });
  });

  test('shows error message when form submission fails', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Failed to add business'
        }
      }
    });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <AddBusiness />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Fill out the form with minimal required fields
    fireEvent.change(screen.getByLabelText(/Business Name/i), { target: { value: 'Test Business' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Restaurant' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Business/i }));
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to add business')).toBeInTheDocument();
    });
    
    // Check that navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AddBusiness />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /Add Business/i }));
    
    // Check for HTML5 validation (this will prevent the form from submitting)
    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
    
    // The API should not have been called
    expect(api.post).not.toHaveBeenCalled();
  });
}); 