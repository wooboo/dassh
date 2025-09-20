import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AuthGuard } from '@/components/AuthGuard';
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
// Mock Kinde auth
const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    logout: jest.fn(),
    login: jest.fn(),
};
jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
    useKindeAuth: () => mockAuthContext,
}));
const TestComponent = () => _jsx("div", { children: "Protected Content" });
describe('AuthGuard Contract', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Interface', () => {
        it('should accept required props with correct types', () => {
            expect(() => {
                render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
        });
        it('should accept optional props with correct types', () => {
            expect(() => {
                render(_jsx(AuthGuard, { fallback: _jsx("div", { children: "Custom Loading" }), unauthorizedFallback: _jsx("div", { children: "Custom Unauthorized" }), redirectTo: "/login", redirectMode: "replace", requiredRoles: ['admin', 'user'], requiredPermissions: ['read:dashboard'], onAuthRequired: () => { }, onAuthSuccess: () => { }, onAuthFailure: () => { }, className: "custom-guard", children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
        });
    });
    describe('Authentication State Contract', () => {
        it('should show loading fallback when authentication is loading', () => {
            const loadingContext = {
                ...mockAuthContext,
                isLoading: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(loadingContext);
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should show custom loading fallback when provided', () => {
            const loadingContext = {
                ...mockAuthContext,
                isLoading: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(loadingContext);
            render(_jsx(AuthGuard, { fallback: _jsx("div", { children: "Custom Loading Message" }), children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Custom Loading Message')).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should show unauthorized fallback when user is not authenticated', () => {
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should show custom unauthorized fallback when provided', () => {
            render(_jsx(AuthGuard, { unauthorizedFallback: _jsx("div", { children: "Please Sign In" }), children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Please Sign In')).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should render children when user is authenticated', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: { id: 'user-123', email: 'test@example.com' },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });
    describe('Redirect Contract', () => {
        it('should redirect to default login page when not authenticated', async () => {
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/api/auth/login');
            });
        });
        it('should redirect to custom URL when specified', async () => {
            render(_jsx(AuthGuard, { redirectTo: "/custom-login", children: _jsx(TestComponent, {}) }));
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/custom-login');
            });
        });
        it('should use replace instead of push when redirectMode is replace', async () => {
            render(_jsx(AuthGuard, { redirectTo: "/login", redirectMode: "replace", children: _jsx(TestComponent, {}) }));
            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith('/login');
                expect(mockPush).not.toHaveBeenCalled();
            });
        });
        it('should not redirect when unauthorizedFallback is provided', () => {
            render(_jsx(AuthGuard, { unauthorizedFallback: _jsx("div", { children: "Please Sign In" }), children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Please Sign In')).toBeInTheDocument();
            expect(mockPush).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });
    describe('Role-Based Access Contract', () => {
        it('should grant access when user has required roles', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    roles: ['admin', 'user']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredRoles: ['user'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
        it('should deny access when user lacks required roles', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    roles: ['user']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredRoles: ['admin'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should grant access when user has any of the required roles', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    roles: ['user']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredRoles: ['admin', 'user'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });
    describe('Permission-Based Access Contract', () => {
        it('should grant access when user has required permissions', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    permissions: ['read:dashboard', 'write:profile']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredPermissions: ['read:dashboard'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
        it('should deny access when user lacks required permissions', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    permissions: ['read:dashboard']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredPermissions: ['admin:users'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
        it('should require all permissions when multiple are specified', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    permissions: ['read:dashboard']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredPermissions: ['read:dashboard', 'write:profile'], children: _jsx(TestComponent, {}) }));
            expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
    });
    describe('Callback Contract', () => {
        it('should call onAuthRequired when authentication is required', () => {
            const onAuthRequired = jest.fn();
            render(_jsx(AuthGuard, { onAuthRequired: onAuthRequired, children: _jsx(TestComponent, {}) }));
            expect(onAuthRequired).toHaveBeenCalledTimes(1);
        });
        it('should call onAuthSuccess when authentication succeeds', () => {
            const onAuthSuccess = jest.fn();
            const authenticatedContext = {
                ...mockAuthContext,
                user: { id: 'user-123', email: 'test@example.com' },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { onAuthSuccess: onAuthSuccess, children: _jsx(TestComponent, {}) }));
            expect(onAuthSuccess).toHaveBeenCalledWith(authenticatedContext.user);
        });
        it('should call onAuthFailure when authorization fails', () => {
            const onAuthFailure = jest.fn();
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    roles: ['user']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            render(_jsx(AuthGuard, { requiredRoles: ['admin'], onAuthFailure: onAuthFailure, children: _jsx(TestComponent, {}) }));
            expect(onAuthFailure).toHaveBeenCalledWith({
                reason: 'insufficient_roles',
                required: ['admin'],
                actual: ['user'],
            });
        });
    });
    describe('Accessibility Contract', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
        it('should announce loading state to screen readers', () => {
            const loadingContext = {
                ...mockAuthContext,
                isLoading: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(loadingContext);
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            const loadingElement = screen.getByLabelText(/loading/i);
            expect(loadingElement).toHaveAttribute('aria-live', 'polite');
        });
        it('should announce authentication errors to screen readers', () => {
            render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            const errorElement = screen.getByText(/unauthorized/i);
            expect(errorElement).toHaveAttribute('role', 'alert');
        });
    });
    describe('Widget Integration Contract', () => {
        it('should integrate with widget system', () => {
            const widgetProps = {
                widgetId: 'auth-guard-1',
                title: 'Authentication Guard',
                refreshable: false,
                configurable: true,
            };
            expect(() => {
                render(_jsx(AuthGuard, { ...widgetProps, children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
        });
        it('should support webhook data integration', () => {
            const webhookData = {
                securityLevel: 'high',
                sessionTimeout: 3600,
                mfaRequired: true,
            };
            expect(() => {
                render(_jsx(AuthGuard, { webhookData: webhookData, children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
        });
    });
    describe('Security Contract', () => {
        it('should not expose sensitive authentication data', () => {
            const { container } = render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            expect(container.innerHTML).not.toContain('token');
            expect(container.innerHTML).not.toContain('secret');
            expect(container.innerHTML).not.toContain('api_key');
        });
        it('should handle tampered user data gracefully', () => {
            const tamperedContext = {
                ...mockAuthContext,
                user: {
                    id: '<script>alert("xss")</script>',
                    email: 'javascript:void(0)',
                    roles: ['admin"<script>']
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(tamperedContext);
            expect(() => {
                render(_jsx(AuthGuard, { children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
            // Should sanitize and not execute scripts
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
        it('should validate role and permission format', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    roles: ['valid-role', '<script>alert("xss")</script>', ''],
                    permissions: ['read:dashboard', 'javascript:void(0)', null]
                },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            expect(() => {
                render(_jsx(AuthGuard, { requiredRoles: ['valid-role'], children: _jsx(TestComponent, {}) }));
            }).not.toThrow();
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });
    describe('Performance Contract', () => {
        it('should not re-render unnecessarily', () => {
            const authenticatedContext = {
                ...mockAuthContext,
                user: { id: 'user-123', email: 'test@example.com' },
                isAuthenticated: true,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(authenticatedContext);
            const TestComponentWithCounter = jest.fn(() => _jsx("div", { children: "Protected Content" }));
            const { rerender } = render(_jsx(AuthGuard, { children: _jsx(TestComponentWithCounter, {}) }));
            // Initial render
            expect(TestComponentWithCounter).toHaveBeenCalledTimes(1);
            // Re-render with same props
            rerender(_jsx(AuthGuard, { children: _jsx(TestComponentWithCounter, {}) }));
            // Should not re-render children if auth state hasn't changed
            expect(TestComponentWithCounter).toHaveBeenCalledTimes(1);
        });
    });
});
