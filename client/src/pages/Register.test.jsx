import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './Register';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

// Mock the styles
jest.mock('../assets/css/register.module.css', () => ({
  __esModule: true,
  default: {
    'register-container': 'register-container',
    'register-header': 'register-header',
    'back-button': 'back-button',
    'logo-container': 'logo-container',
    'register-logo': 'register-logo',
    'register-form-container': 'register-form-container',
    'register-form-header': 'register-form-header',
    'step-indicator': 'step-indicator',
    'step': 'step',
    'step-line': 'step-line',
    'form-step': 'form-step',
    'form-group': 'form-group',
    'form-row': 'form-row',
    'half': 'half',
    'form-actions': 'form-actions',
    'btn-next': 'btn-next',
    'btn-back': 'btn-back',
    'btn-register': 'btn-register',
    'login-link': 'login-link',
    'error': 'error',
    'error-message': 'error-message',
    'main-error': 'main-error',
    'password-hint': 'password-hint'
  },
}));

// Mock the logo
jest.mock('../../assets/img/logo.png', () => 'logo.png');

// Mock the useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    signUp: jest.fn(() => Promise.resolve({ data: { user: { id: '123' } } })),
  })),
}));

global.TextEncoder = require('util').TextEncoder;

// Mock the useNavigate hook
jest.mock('react-router-dom', () => {
  const actualReactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...actualReactRouterDom,
    useNavigate: jest.fn(),
    Link: jest.fn(({ children, to }) => <a href={to}>{children}</a>),
  };
});

// Mock the supabase client
jest.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(() => Promise.resolve({ data: { user: { id: '123' } }, error: null })),
    },
  },
}));

describe('Register Component', () => {
  let signUpMock;
  let navigateMock;
  let genderSelect;
  let heightInput;
  let weightInput;
  let goalSelect;
  let createAccountButton;

  beforeEach(() => {
    signUpMock = jest.fn(() => Promise.resolve({ data: { user: { id: '123' } }, error: null }));
    useAuth.mockImplementation(() => ({ signUp: signUpMock }));
    navigateMock = jest.fn();
    useNavigate.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the register form', () => {
    render(<Register />);
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    render(<Register />);
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  it('displays the general error message when the signUp function fails', async () => {
    signUpMock.mockImplementation(() => Promise.resolve({ data: null, error: { message: 'Failed to create account' } }));
    useAuth.mockImplementation(() => ({ signUp: signUpMock }));

    render(<Register />);

    // Step 1
    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Step 2
    genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });
    heightInput = screen.getByLabelText('Height (cm)');
    fireEvent.change(heightInput, { target: { value: '180' } });
    weightInput = screen.getByLabelText('Weight (kg)');
    fireEvent.change(weightInput, { target: { value: '80' } });
    goalSelect = screen.getByLabelText('Fitness Goal');
    fireEvent.change(goalSelect, { target: { value: 'Weight Loss' } });

    createAccountButton = screen.getByText('Create Account');
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create account')).not.toBeInTheDocument();
    });
  });
});