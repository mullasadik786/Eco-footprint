```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('Eco Footprint Core Application Evaluation Tests', () => {
  test('should render application hero title successfully', () => {
    render(<App />);
    const appTitle = screen.getByText(/Eco Footprint/i);
    expect(appTitle).toBeInTheDocument();
  });

  test('should increase carbon offset score when completing daily challenge', () => {
    render(<App />);
    const challengeButton = screen.getByRole('button', { name: /Mark today's carbon saving challenge as completed/i });
    
    // Check initial user metric streak render
    expect(screen.getByText(/0 Days Streak/i)).toBeInTheDocument();
    
    // Fire user action element click event handler
    fireEvent.click(challengeButton);
    
    // Check updated game statistics score elements
    expect(screen.getByText(/1 Days Streak/i)).toBeInTheDocument();
    expect(challengeButton).toBeDisabled();
  });
});