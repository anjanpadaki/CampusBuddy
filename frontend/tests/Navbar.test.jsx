import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../src/components/Navbar';
import { AuthContext } from '../src/context/AuthContext';

describe('Navbar Component', () => {
  it('renders the brand name', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Campus/i)).toBeDefined();
    expect(screen.getByText(/Buddy/i)).toBeDefined();
  });

  it('renders user info when logged in', () => {
    const user = { name: 'John Doe', role: 'student' };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user, logout: vi.fn() }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('student')).toBeDefined();
  });
});
