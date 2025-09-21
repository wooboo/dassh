/**
 * Route Protection Integration Test
 * 
 * This test verifies the end-to-end route protection functionality.
 * It should fail initially and pass only when middleware and AuthGuard work together.
 * 
 * Constitutional Requirements:
 * - Next.js middleware for route protection
 * - AuthGuard component for UI protection
 * - Kinde authentication integration
 * - Proper redirect handling
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';
import { AuthGuard } from '@/components/AuthGuard';
import { AuthProvider } from '@/providers/AuthProvider';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/dashboard',
  redirect: jest.fn(),
}));

// Mock Kinde auth for middleware
const mockKindeServerSession = {
  getUser: jest.fn(),
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
};

jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
  getKindeServerSession: () => mockKindeServerSession,
  useKindeAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  withAuth: (config: any) => (request: NextRequest) => {
    // Simplified middleware simulation
    const url = request.nextUrl.clone();
    const isProtectedRoute = url.pathname.startsWith('/dashboard');
    
    if (isProtectedRoute && !mockKindeServerSession.isAuthenticated()) {
      url.pathname = '/api/auth/login';
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  },
}));

// Mock session manager
jest.mock('@/lib/session-manager', () => ({
  sessionManager: {
    validateSession: jest.fn(),
    updateActivity: jest.fn(),
  },
}));

// Test components
const ProtectedDashboard: React.FC = () => (
  <AuthGuard>
    <div data-testid="protected-dashboard">
      <h1>Dashboard</h1>
      <p>This is protected content</p>
    </div>
  </AuthGuard>
);

const AdminPanel: React.FC = () => (
  <AuthGuard requiredRoles={['admin']}>
    <div data-testid="admin-panel">
      <h1>Admin Panel</h1>
      <p>Admin only content</p>
    </div>
  </AuthGuard>
);

const SettingsPage: React.FC = () => (
  <AuthGuard requiredPermissions={['settings:write']}>
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <p>Settings page content</p>
    </div>
  </AuthGuard>
);

describe('Route Protection Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Middleware Route Protection', () => {
    it('should redirect unauthenticated users from protected routes', async () => {
      // Mock unauthenticated state
      mockKindeServerSession.isAuthenticated.mockReturnValue(false);
      mockKindeServerSession.getUser.mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307); // Redirect status
      expect(response?.headers.get('location')).toContain('/api/auth/login');
    });

    it('should allow authenticated users to access protected routes', async () => {
      // Mock authenticated state
      mockKindeServerSession.isAuthenticated.mockReturnValue(true);
      mockKindeServerSession.getUser.mockReturnValue({
        id: 'kinde_user_123',
        email: 'test@example.com',
      });

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
      });

      const response = await middleware(request);

      expect(response?.status).toBe(200);
      expect(response?.headers.get('location')).toBeNull();
    });

    it('should allow public routes without authentication', async () => {
      // Mock unauthenticated state
      mockKindeServerSession.isAuthenticated.mockReturnValue(false);

      const publicRoutes = [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/api/health',
        'http://localhost:3000/login',
      ];

      for (const url of publicRoutes) {
        const request = new NextRequest(url, { method: 'GET' });
        const response = await middleware(request);

        expect(response?.status).not.toBe(307); // Should not redirect
      }
    });

    it('should preserve original URL in redirect for return navigation', async () => {
      mockKindeServerSession.isAuthenticated.mockReturnValue(false);

      const request = new NextRequest('http://localhost:3000/dashboard/settings?tab=profile', {
        method: 'GET',
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      const location = response?.headers.get('location');
      expect(location).toContain('/api/auth/login');
      expect(location).toContain('post_login_redirect_url');
      expect(location).toContain(encodeURIComponent('/dashboard/settings?tab=profile'));
    });

    it('should handle API routes separately from page routes', async () => {
      mockKindeServerSession.isAuthenticated.mockReturnValue(false);

      const apiRequest = new NextRequest('http://localhost:3000/api/profile', {
        method: 'GET',
      });

      const response = await middleware(apiRequest);

      // API routes should return 401, not redirect
      expect(response?.status).toBe(401);
      expect(response?.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('AuthGuard Component Protection', () => {
    it('should show loading state while checking authentication', () => {
      const mockAuthContext = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      );

      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByTestId('protected-dashboard')).not.toBeInTheDocument();
    });

    it('should redirect unauthenticated users to login', async () => {
      const mockAuthContext = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/api/auth/login');
      });

      expect(screen.queryByTestId('protected-dashboard')).not.toBeInTheDocument();
    });

    it('should render protected content for authenticated users', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'test@example.com',
          given_name: 'John',
          family_name: 'Doe',
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      );

      expect(screen.getByTestId('protected-dashboard')).toBeInTheDocument();
      expect(screen.getByText('This is protected content')).toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow access for users with required roles', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'admin@example.com',
          roles: ['admin', 'user'],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <AdminPanel />
        </AuthProvider>
      );

      expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
      expect(screen.getByText('Admin only content')).toBeInTheDocument();
    });

    it('should deny access for users without required roles', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'user@example.com',
          roles: ['user'], // Missing 'admin' role
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <AdminPanel />
        </AuthProvider>
      );

      expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
      expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
    });

    it('should handle missing role data gracefully', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'user@example.com',
          // roles property missing
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <AdminPanel />
        </AuthProvider>
      );

      expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
      expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
    });
  });

  describe('Permission-Based Access Control', () => {
    it('should allow access for users with required permissions', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'user@example.com',
          permissions: ['settings:read', 'settings:write', 'profile:read'],
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <SettingsPage />
        </AuthProvider>
      );

      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByText('Settings page content')).toBeInTheDocument();
    });

    it('should deny access for users without required permissions', () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'user@example.com',
          permissions: ['settings:read'], // Missing 'settings:write'
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      render(
        <AuthProvider>
          <SettingsPage />
        </AuthProvider>
      );

      expect(screen.queryByTestId('settings-page')).not.toBeInTheDocument();
      expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
    });
  });

  describe('Deep Link and Redirect Flow', () => {
    it('should preserve deep links through authentication flow', async () => {
      // Simulate accessing a deep link while unauthenticated
      const originalUrl = '/dashboard/analytics?period=30d&metric=users';
      
      // Mock unauthenticated middleware response
      mockKindeServerSession.isAuthenticated.mockReturnValue(false);
      
      const request = new NextRequest(`http://localhost:3000${originalUrl}`, {
        method: 'GET',
      });

      const middlewareResponse = await middleware(request);

      expect(middlewareResponse?.status).toBe(307);
      const location = middlewareResponse?.headers.get('location');
      expect(location).toContain(encodeURIComponent(originalUrl));

      // After successful authentication, should redirect back
      mockKindeServerSession.isAuthenticated.mockReturnValue(true);
      mockKindeServerSession.getUser.mockReturnValue({
        id: 'kinde_user_123',
        email: 'test@example.com',
      });

      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'test@example.com',
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      // Mock URL search params for return redirect
      Object.defineProperty(window, 'location', {
        value: {
          search: `?redirect=${encodeURIComponent(originalUrl)}`,
        },
      });

      render(
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(originalUrl);
      });
    });

    it('should handle invalid redirect URLs safely', async () => {
      const mockAuthContext = {
        user: {
          id: 'kinde_user_123',
          email: 'test@example.com',
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(mockAuthContext);

      // Mock malicious redirect URL
      Object.defineProperty(window, 'location', {
        value: {
          search: '?redirect=https://malicious.com/steal-data',
        },
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid redirect URL')
        );
      });

      // Should redirect to default safe location
      expect(mockPush).toHaveBeenCalledWith('/dashboard');

      consoleSpy.mockRestore();
    });
  });

  describe('Session Validation Integration', () => {
    it('should validate session on protected route access', async () => {
      const sessionManager = require('@/lib/session-manager').sessionManager;
      sessionManager.validateSession.mockResolvedValue(true);

      mockKindeServerSession.isAuthenticated.mockReturnValue(true);
      mockKindeServerSession.getUser.mockReturnValue({
        id: 'kinde_user_123',
        email: 'test@example.com',
      });

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
          'cookie': 'session_id=valid-session-123',
        },
      });

      await middleware(request);

      expect(sessionManager.validateSession).toHaveBeenCalledWith('valid-session-123');
    });

    it('should redirect when session is invalid despite Kinde authentication', async () => {
      const sessionManager = require('@/lib/session-manager').sessionManager;
      sessionManager.validateSession.mockResolvedValue(false);

      mockKindeServerSession.isAuthenticated.mockReturnValue(true);
      mockKindeServerSession.getUser.mockReturnValue({
        id: 'kinde_user_123',
        email: 'test@example.com',
      });

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
          'cookie': 'session_id=invalid-session-456',
        },
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      expect(response?.headers.get('location')).toContain('/api/auth/login');
    });

    it('should update session activity on successful access', async () => {
      const sessionManager = require('@/lib/session-manager').sessionManager;
      sessionManager.validateSession.mockResolvedValue(true);
      sessionManager.updateActivity.mockResolvedValue(undefined);

      mockKindeServerSession.isAuthenticated.mockReturnValue(true);

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
          'cookie': 'session_id=valid-session-123',
        },
      });

      await middleware(request);

      expect(sessionManager.updateActivity).toHaveBeenCalledWith('valid-session-123');
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should handle authentication service errors gracefully', async () => {
      mockKindeServerSession.isAuthenticated.mockImplementation(() => {
        throw new Error('Kinde service unavailable');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
      });

      const response = await middleware(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Authentication error'),
        expect.any(Error)
      );

      // Should redirect to login as fallback
      expect(response?.status).toBe(307);

      consoleSpy.mockRestore();
    });

    it('should handle database errors during session validation', async () => {
      const sessionManager = require('@/lib/session-manager').sessionManager;
      sessionManager.validateSession.mockRejectedValue(new Error('Database connection failed'));

      mockKindeServerSession.isAuthenticated.mockReturnValue(true);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
          'cookie': 'session_id=session-123',
        },
      });

      const response = await middleware(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Session validation error'),
        expect.any(Error)
      );

      // Should allow access if Kinde auth is valid (fallback)
      expect(response?.status).not.toBe(307);

      consoleSpy.mockRestore();
    });
  });
});