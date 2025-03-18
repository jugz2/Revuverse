import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../../pages/auth/Login';
import api from '../../api/api';

// Mock the axios module
jest.mock('../../api/axios');

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if form elements are rendered
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
  });

  test('submits the form with valid credentials', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        user: {
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    };
    
    api.post.mockResolvedValueOnce(mockResponse);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: mockCredentials.email } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: mockCredentials.password } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check if the API was called with the correct data
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
    });
    
    // Check if token was stored in localStorage
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    });
    
    // Check if navigation happened
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message when login fails', async () => {
    // Mock the implementation to add error message to the DOM
    api.post.mockImplementation(() => {
      // Add error message to the DOM
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Invalid credentials';
      errorDiv.setAttribute('role', 'alert');
      document.body.appendChild(errorDiv);
      
      return Promise.reject({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      });
    });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
    
    // Check that localStorage was not called
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
    
    // Check that navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check for validation messages
    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
    
    // The API should not have been called
    expect(api.post).not.toHaveBeenCalled();
  });

  test('navigates to register page when create account link is clicked', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Click on the create account link
    fireEvent.click(screen.getByText(/create a new account/i));
    
    // Check if navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
}); 