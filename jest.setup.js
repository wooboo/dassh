import '@testing-library/jest-dom';

// Setup for jest-axe
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Mock Next.js modules that aren't available in test environment
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Kinde Auth
jest.mock('@kinde-oss/kinde-auth-nextjs/server', () => ({
  getKindeServerSession: () => ({
    getUser: jest.fn(),
    isAuthenticated: jest.fn(),
  }),
}));

// Global test setup
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));