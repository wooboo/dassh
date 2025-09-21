import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProfileDropdown } from '@/components/ProfileDropdown';
expect.extend(toHaveNoViolations);
// Mock Kinde auth
const mockUser = {
    id: 'kinde_user_123',
    email: 'test@example.com',
    given_name: 'John',
    family_name: 'Doe',
    picture: 'https://example.com/avatar.jpg',
};
const mockAuthContext = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    logout: jest.fn(),
    login: jest.fn(),
};
jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
    useKindeAuth: () => mockAuthContext,
}));
describe('ProfileDropdown Contract', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Interface', () => {
        it('should accept required props with correct types', () => {
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            }).not.toThrow();
        });
        it('should accept optional props with correct types', () => {
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "main-page", variant: "minimal", showOnlineStatus: true, customAvatar: "https://custom.com/avatar.jpg", className: "custom-dropdown", disabled: false, onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            }).not.toThrow();
        });
        it('should handle missing optional props gracefully', () => {
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            }).not.toThrow();
        });
    });
    describe('Rendering Contract', () => {
        it('should render user avatar with fallback to initials', () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            // Should show avatar or initials
            const avatar = screen.getByRole('button', { name: /user profile/i });
            expect(avatar).toBeInTheDocument();
        });
        it('should display user name and email in full variant', () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
        it('should hide user details in minimal variant', () => {
            render(_jsx(ProfileDropdown, { placement: "main-page", variant: "minimal", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
            expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
        });
        it('should show online status when enabled', () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", showOnlineStatus: true, onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            expect(screen.getByLabelText(/online status/i)).toBeInTheDocument();
        });
    });
    describe('Interaction Contract', () => {
        it('should open dropdown on click', async () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            fireEvent.click(trigger);
            await waitFor(() => {
                expect(screen.getByRole('menu')).toBeInTheDocument();
            });
        });
        it('should call onProfileClick when profile item is clicked', async () => {
            const onProfileClick = jest.fn();
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: onProfileClick, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            fireEvent.click(trigger);
            await waitFor(() => {
                const profileItem = screen.getByRole('menuitem', { name: /profile/i });
                fireEvent.click(profileItem);
                expect(onProfileClick).toHaveBeenCalledTimes(1);
            });
        });
        it('should call onSettingsClick when settings item is clicked', async () => {
            const onSettingsClick = jest.fn();
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: onSettingsClick, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            fireEvent.click(trigger);
            await waitFor(() => {
                const settingsItem = screen.getByRole('menuitem', { name: /settings/i });
                fireEvent.click(settingsItem);
                expect(onSettingsClick).toHaveBeenCalledTimes(1);
            });
        });
        it('should call onLogoutClick when logout item is clicked', async () => {
            const onLogoutClick = jest.fn();
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: onLogoutClick }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            fireEvent.click(trigger);
            await waitFor(() => {
                const logoutItem = screen.getByRole('menuitem', { name: /logout/i });
                fireEvent.click(logoutItem);
                expect(onLogoutClick).toHaveBeenCalledTimes(1);
            });
        });
        it('should close dropdown on escape key', async () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            fireEvent.click(trigger);
            await waitFor(() => {
                expect(screen.getByRole('menu')).toBeInTheDocument();
            });
            fireEvent.keyDown(document, { key: 'Escape' });
            await waitFor(() => {
                expect(screen.queryByRole('menu')).not.toBeInTheDocument();
            });
        });
    });
    describe('Accessibility Contract', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
        it('should support keyboard navigation', async () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            // Focus trigger
            trigger.focus();
            expect(trigger).toHaveFocus();
            // Open with Enter
            fireEvent.keyDown(trigger, { key: 'Enter' });
            await waitFor(() => {
                expect(screen.getByRole('menu')).toBeInTheDocument();
            });
        });
        it('should have proper ARIA attributes', () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            const trigger = screen.getByRole('button', { name: /user profile/i });
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
        });
    });
    describe('Responsive Contract', () => {
        it('should adapt layout for different placements', () => {
            const { rerender } = render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            expect(screen.getByTestId('profile-dropdown-dashboard')).toBeInTheDocument();
            rerender(_jsx(ProfileDropdown, { placement: "main-page", variant: "minimal", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            expect(screen.getByTestId('profile-dropdown-main-page')).toBeInTheDocument();
        });
    });
    describe('Widget Integration Contract', () => {
        it('should integrate with widget system', () => {
            const widgetProps = {
                widgetId: 'profile-dropdown-1',
                title: 'User Profile',
                refreshable: false,
                configurable: true,
            };
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { }, ...widgetProps }));
            }).not.toThrow();
        });
        it('should support webhook data integration', () => {
            const webhookData = {
                userId: 'user-123',
                lastActivity: '2024-01-20T10:30:00Z',
                sessionCount: 3,
            };
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", webhookData: webhookData, onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            }).not.toThrow();
        });
    });
    describe('Security Contract', () => {
        it('should handle unauthenticated state gracefully', () => {
            const unauthenticatedContext = {
                ...mockAuthContext,
                user: null,
                isAuthenticated: false,
            };
            jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(unauthenticatedContext);
            expect(() => {
                render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            }).not.toThrow();
        });
        it('should not expose sensitive user data in DOM', () => {
            render(_jsx(ProfileDropdown, { placement: "dashboard", variant: "full", onProfileClick: () => { }, onSettingsClick: () => { }, onLogoutClick: () => { } }));
            // Ensure sensitive data is not exposed
            const container = screen.getByTestId('profile-dropdown-dashboard');
            expect(container).not.toHaveTextContent('kinde_user_123'); // Should not show raw user ID
        });
    });
});
