import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'jest';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add your test assertions here
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // Add more test cases as needed
}); 