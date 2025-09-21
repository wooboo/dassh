/**
 * Complete Sign-in Flow Integration Test
 * 
 * This test verifies the end-to-end sign-in flow from user action to authenticated state.
 * It should fail initially and pass only when all authentication components work together.
 * 
 * Constitutional Requirements:
 * - Kinde authentication integration
 * - Database session persistence
 * - Real-time UI state updates
 * - Security validation throughout
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { AuthButton } from '@/components/AuthButton';
import { sessionManager } from '@/lib/session-manager';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/dashboard',
}));

// Mock Kinde auth with step-by-step flow simulation
const mockKindeAuth = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  getToken: jest.fn(),
};

jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
  useKindeAuth: () => mockKindeAuth,
  KindeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock session manager
jest.mock('@/lib/session-manager', () => ({
  sessionManager: {
    createSession: jest.fn(),
    validateSession: jest.fn(),
    updateActivity: jest.fn(),
    terminateSession: jest.fn(),
  },
}));

// Mock API calls
global.fetch = jest.fn();

// Test component that uses authentication
const TestDashboard: React.FC = () => {
  return (
    <div data-testid="dashboard">
      <div data-testid="header">
        <ProfileDropdown
          placement="main-page"
          variant="minimal"
          onProfileClick={() => {}}
          onSettingsClick={() => {}}
          onLogoutClick={() => {}}
        />
      </div>
      <div data-testid="content">
        <h1>Dashboard Content</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
};

const TestSignInPage: React.FC = () => {
  return (
    <div data-testid="signin-page">
      <h1>Sign In</h1>
      <AuthButton
        mode="signin"
        onSuccess={() => {}}
        onError={() => {}}
      />
    </div>
  );
};

describe('Complete Sign-in Flow Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset auth state to unauthenticated
    mockKindeAuth.user = null;
    mockKindeAuth.isAuthenticated = false;
    mockKindeAuth.isLoading = false;
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('Unauthenticated User Journey', () => {
    it('should show sign-in page when user is not authenticated', () => {
      render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should initiate Kinde auth flow when sign-in button is clicked', async () => {
      render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.click(signInButton);

      expect(mockKindeAuth.login).toHaveBeenCalledTimes(1);
    });

    it('should show loading state during authentication', async () => {
      // Simulate loading state
      mockKindeAuth.isLoading = true;

      render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Authentication Success Flow', () => {
    it('should complete full authentication flow from click to authenticated state', async () => {
      let authCallback: (() => void) | null = null;

      // Mock Kinde login to simulate async authentication
      mockKindeAuth.login.mockImplementation(() => {
        return new Promise((resolve) => {
          authCallback = () => {
            // Simulate successful authentication
            mockKindeAuth.isLoading = false;
            mockKindeAuth.isAuthenticated = true;
            mockKindeAuth.user = {
              id: 'kinde_user_123',
              email: 'test@example.com',
              given_name: 'John',
              family_name: 'Doe',
              picture: 'https://example.com/avatar.jpg',
            };
            resolve(mockKindeAuth.user);
          };
          
          // Start loading state
          mockKindeAuth.isLoading = true;
          
          // Simulate Kinde redirect flow
          setTimeout(authCallback, 100);
        });
      });

      // Mock session creation
      jest.mocked(sessionManager.createSession).mockResolvedValue({
        id: 'session-123',
        userId: 'user-123',
        kindeSessionId: 'kinde_session_456',
        status: 'active',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { rerender } = render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      // Step 1: Click sign-in button
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      // Step 2: Verify loading state
      expect(mockKindeAuth.login).toHaveBeenCalledTimes(1);

      // Step 3: Wait for authentication to complete
      await waitFor(() => {
        expect(mockKindeAuth.isAuthenticated).toBe(true);
      });

      // Step 4: Verify session creation
      await waitFor(() => {
        expect(sessionManager.createSession).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: expect.any(String),
            kindeSessionId: expect.any(String),
          })
        );
      });

      // Step 5: Rerender with authenticated state to verify UI updates
      rerender(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      // Step 6: Verify dashboard is accessible
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome to your dashboard!')).toBeInTheDocument();
    });

    it('should create session with correct metadata after successful login', async () => {
      // Mock successful authentication
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
      };

      // Mock browser environment
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(sessionManager.createSession).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: expect.any(String),
            kindeSessionId: expect.any(String),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            metadata: expect.objectContaining({
              loginMethod: 'kinde',
              timestamp: expect.any(String),
            }),
          })
        );
      });
    });

    it('should update profile dropdown with user information after login', async () => {
      // Mock successful authentication
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/avatar.jpg',
      };

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      // Profile dropdown should show user info
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      
      // Avatar should be present
      const avatar = screen.getByRole('button', { name: /user profile/i });
      expect(avatar).toBeInTheDocument();
    });

    it('should redirect to intended destination after successful login', async () => {
      // Mock authentication with redirect parameter
      const mockSearchParams = new URLSearchParams('?redirect=/dashboard/settings');
      
      Object.defineProperty(window, 'location', {
        value: {
          search: mockSearchParams.toString(),
        },
      });

      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
      };

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard/settings');
      });
    });
  });

  describe('Authentication Error Handling', () => {
    it('should handle Kinde authentication errors gracefully', async () => {
      const authError = new Error('Authentication failed');
      mockKindeAuth.login.mockRejectedValue(authError);

      const onError = jest.fn();

      render(
        <AuthProvider>
          <AuthButton
            mode="signin"
            onSuccess={() => {}}
            onError={onError}
          />
        </AuthProvider>
      );

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(authError);
      });

      // Should show error message to user
      expect(screen.getByText(/authentication failed/i)).toBeInTheDocument();
    });

    it('should handle session creation errors after successful Kinde auth', async () => {
      // Mock successful Kinde auth but failed session creation
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
      };

      jest.mocked(sessionManager.createSession).mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to create session'),
          expect.any(Error)
        );
      });

      // Should still allow access but log the error
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle network errors during authentication flow', async () => {
      // Mock network failure
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const onError = jest.fn();

      render(
        <AuthProvider>
          <AuthButton
            mode="signin"
            onSuccess={() => {}}
            onError={onError}
          />
        </AuthProvider>
      );

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Network error'),
          })
        );
      });
    });
  });

  describe('Security Validation During Sign-in', () => {
    it('should validate user data integrity after Kinde authentication', async () => {
      // Mock potentially tampered user data
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: '<script>alert("xss")</script>',
        email: 'javascript:void(0)',
        given_name: 'John<img src="x" onerror="alert()">',
        family_name: 'Doe',
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid user data detected')
        );
      });

      // Should sanitize or reject the user data
      expect(screen.queryByText('<script>')).not.toBeInTheDocument();
      expect(screen.queryByText('javascript:')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should enforce HTTPS for authentication in production', async () => {
      // Mock production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Mock non-HTTPS location
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'http:',
          hostname: 'example.com',
        },
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('HTTPS required for authentication in production')
        );
      });

      // Should prevent authentication over HTTP in production
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      expect(signInButton).toBeDisabled();

      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });

    it('should validate session token integrity after creation', async () => {
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
      };

      // Mock token validation
      mockKindeAuth.getToken.mockResolvedValue('valid.jwt.token');

      jest.mocked(sessionManager.validateSession).mockResolvedValue(true);

      render(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(sessionManager.validateSession).toHaveBeenCalledWith(
          expect.any(String)
        );
      });
    });
  });

  describe('Real-time State Synchronization', () => {
    it('should synchronize authentication state across multiple components', async () => {
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
      };

      const MultiComponentTest: React.FC = () => (
        <AuthProvider>
          <div data-testid="component-1">
            <ProfileDropdown
              placement="dashboard"
              variant="full"
              onProfileClick={() => {}}
              onSettingsClick={() => {}}
              onLogoutClick={() => {}}
            />
          </div>
          <div data-testid="component-2">
            <ProfileDropdown
              placement="main-page"
              variant="minimal"
              onProfileClick={() => {}}
              onSettingsClick={() => {}}
              onLogoutClick={() => {}}
            />
          </div>
        </AuthProvider>
      );

      render(<MultiComponentTest />);

      // Both components should show consistent user state
      const components = screen.getAllByText('John Doe');
      expect(components).toHaveLength(1); // Full variant shows name, minimal doesn't

      const avatars = screen.getAllByRole('button', { name: /user profile/i });
      expect(avatars).toHaveLength(2); // Both should have avatars
    });

    it('should update all components when authentication state changes', async () => {
      const { rerender } = render(
        <AuthProvider>
          <TestSignInPage />
        </AuthProvider>
      );

      // Initially unauthenticated
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();

      // Simulate authentication
      mockKindeAuth.isAuthenticated = true;
      mockKindeAuth.user = {
        id: 'kinde_user_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
      };

      rerender(
        <AuthProvider>
          <TestDashboard />
        </AuthProvider>
      );

      // Should now show authenticated content
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});