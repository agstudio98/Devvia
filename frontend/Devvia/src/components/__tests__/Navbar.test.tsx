import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

// Mock de useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'es',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('Navbar Component', () => {
  it('renders brand name', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('Devvia')).toBeInTheDocument();
  });

  it('renders login button when not logged in', () => {
    render(
      <BrowserRouter>
        <Navbar isLoggedIn={false} />
      </BrowserRouter>
    );
    expect(screen.getByText('NAV.LOGIN')).toBeInTheDocument();
  });

  it('renders user name when logged in', () => {
    const user = { nombre: 'Agustin' };
    render(
      <BrowserRouter>
        <Navbar isLoggedIn={true} user={user} />
      </BrowserRouter>
    );
    expect(screen.getByText('Agustin')).toBeInTheDocument();
  });
});
