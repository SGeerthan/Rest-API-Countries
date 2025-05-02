import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'jest';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from '../components/Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mock the firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  auth: {}
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn()
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
      <ToastContainer />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByText('Register Here')).toBeInTheDocument();
  });

  it('handles form submission with valid credentials', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    
    renderLogin();
    
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });
  });

  it('handles form submission with invalid credentials', async () => {
    const errorMessage = 'Invalid email or password';
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));
    
    renderLogin();
    
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'wrong@example.com',
        'wrongpassword'
      );
    });
  });

  it('validates required fields', () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    expect(screen.getByLabelText('Email address')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  it('validates email format', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email address');
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.blur(emailInput);
    
    expect(emailInput).toBeInvalid();
  });
}); 