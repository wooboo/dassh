/**
 * UserAvatar Contract Test
 * 
 * This test defines the expected interface and behavior of the UserAvatar component.
 * It should fail initially and pass only when the component is implemented correctly.
 * 
 * Constitutional Requirements:
 * - Uses shadcn/ui components only
 * - WCAG 2.1 AA accessibility compliance  
 * - Widget-centric architecture with reusability
 * - Kinde authentication integration
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserAvatar } from '@/components/UserAvatar';

// Mock user data
const mockUser = {
  id: 'kinde_user_123',
  email: 'john.doe@example.com',
  given_name: 'John',
  family_name: 'Doe',
  picture: 'https://example.com/avatar.jpg',
};

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
};

jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
  useKindeAuth: () => mockAuthContext,
}));

describe('UserAvatar Contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Interface', () => {
    it('should accept required props with correct types', () => {
      expect(() => {
        render(
          <UserAvatar
            user={mockUser}
            size="md"
          />
        );
      }).not.toThrow();
    });

    it('should accept optional props with correct types', () => {
      expect(() => {
        render(
          <UserAvatar
            user={mockUser}
            size="lg"
            showOnlineStatus={true}
            onlineStatus="online"
            fallbackType="initials"
            className="custom-avatar"
            onClick={() => {}}
            alt="Custom alt text"
          />
        );
      }).not.toThrow();
    });

    it('should handle missing user gracefully', () => {
      expect(() => {
        render(
          <UserAvatar
            user={null}
            size="md"
          />
        );
      }).not.toThrow();
    });
  });

  describe('Rendering Contract', () => {
    it('should display user image when available', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      const avatar = screen.getByRole('img', { name: /john doe/i });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockUser.picture);
    });

    it('should show initials fallback when no image', () => {
      const userWithoutImage = {
        ...mockUser,
        picture: null,
      };

      render(
        <UserAvatar
          user={userWithoutImage}
          size="md"
          fallbackType="initials"
        />
      );

      expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe initials
    });

    it('should show icon fallback when specified', () => {
      const userWithoutImage = {
        ...mockUser,
        picture: null,
      };

      render(
        <UserAvatar
          user={userWithoutImage}
          size="md"
          fallbackType="icon"
        />
      );

      expect(screen.getByLabelText(/user icon/i)).toBeInTheDocument();
    });

    it('should apply different sizes correctly', () => {
      const { rerender } = render(
        <UserAvatar
          user={mockUser}
          size="sm"
        />
      );

      let avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-8', 'w-8'); // Small size

      rerender(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-10', 'w-10'); // Medium size

      rerender(
        <UserAvatar
          user={mockUser}
          size="lg"
        />
      );

      avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-12', 'w-12'); // Large size

      rerender(
        <UserAvatar
          user={mockUser}
          size="xl"
        />
      );

      avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-16', 'w-16'); // Extra large size
    });

    it('should show online status indicator when enabled', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          showOnlineStatus={true}
          onlineStatus="online"
        />
      );

      const statusIndicator = screen.getByLabelText(/online status/i);
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveClass('bg-green-500'); // Online status color
    });

    it('should show different status colors', () => {
      const { rerender } = render(
        <UserAvatar
          user={mockUser}
          size="md"
          showOnlineStatus={true}
          onlineStatus="online"
        />
      );

      let statusIndicator = screen.getByLabelText(/online status/i);
      expect(statusIndicator).toHaveClass('bg-green-500'); // Online

      rerender(
        <UserAvatar
          user={mockUser}
          size="md"
          showOnlineStatus={true}
          onlineStatus="away"
        />
      );

      statusIndicator = screen.getByLabelText(/away status/i);
      expect(statusIndicator).toHaveClass('bg-yellow-500'); // Away

      rerender(
        <UserAvatar
          user={mockUser}
          size="md"
          showOnlineStatus={true}
          onlineStatus="offline"
        />
      );

      statusIndicator = screen.getByLabelText(/offline status/i);
      expect(statusIndicator).toHaveClass('bg-gray-500'); // Offline
    });
  });

  describe('Interaction Contract', () => {
    it('should call onClick when avatar is clicked', () => {
      const onClick = jest.fn();
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          onClick={onClick}
        />
      );

      const avatar = screen.getByRole('button'); // Should be a button when clickable
      fireEvent.click(avatar);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(mockUser);
    });

    it('should not be clickable when onClick is not provided', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      // Should not be a button when not clickable
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should handle image load errors gracefully', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          fallbackType="initials"
        />
      );

      const avatar = screen.getByRole('img');
      fireEvent.error(avatar);

      // Should fallback to initials on image error
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('Accessibility Contract', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper alt text', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt', 'John Doe avatar');
    });

    it('should use custom alt text when provided', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          alt="Custom avatar description"
        />
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt', 'Custom avatar description');
    });

    it('should support keyboard navigation when clickable', () => {
      const onClick = jest.fn();
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          onClick={onClick}
        />
      );

      const avatar = screen.getByRole('button');
      
      // Should be focusable
      avatar.focus();
      expect(avatar).toHaveFocus();

      // Should activate on Enter
      fireEvent.keyDown(avatar, { key: 'Enter' });
      expect(onClick).toHaveBeenCalled();

      // Should activate on Space
      fireEvent.keyDown(avatar, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('should have proper ARIA attributes when clickable', () => {
      const onClick = jest.fn();
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          onClick={onClick}
        />
      );

      const avatar = screen.getByRole('button');
      expect(avatar).toHaveAttribute('aria-label', 'John Doe avatar');
      expect(avatar).toHaveAttribute('type', 'button');
    });

    it('should announce online status to screen readers', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          showOnlineStatus={true}
          onlineStatus="online"
        />
      );

      const statusIndicator = screen.getByLabelText(/online status/i);
      expect(statusIndicator).toHaveAttribute('aria-label', 'User is online');
    });
  });

  describe('Responsive Contract', () => {
    it('should scale appropriately on different screen sizes', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('rounded-full'); // Should always be circular
      expect(avatar).toHaveClass('object-cover'); // Should cover container properly
    });
  });

  describe('Widget Integration Contract', () => {
    it('should integrate with widget system', () => {
      const widgetProps = {
        widgetId: 'user-avatar-1',
        title: 'User Avatar',
        refreshable: false,
        configurable: true,
      };

      expect(() => {
        render(
          <UserAvatar
            user={mockUser}
            size="md"
            {...widgetProps}
          />
        );
      }).not.toThrow();
    });

    it('should support webhook data integration', () => {
      const webhookData = {
        lastActivity: '2024-01-20T10:30:00Z',
        sessionCount: 3,
        onlineStatus: 'online',
      };

      expect(() => {
        render(
          <UserAvatar
            user={mockUser}
            size="md"
            webhookData={webhookData}
            showOnlineStatus={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Security Contract', () => {
    it('should not expose sensitive user data in DOM', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
        />
      );

      const container = screen.getByRole('img').parentElement;
      expect(container?.outerHTML).not.toContain('kinde_user_123'); // Should not show raw user ID
    });

    it('should handle malicious image URLs safely', () => {
      const userWithMaliciousImage = {
        ...mockUser,
        picture: 'javascript:alert("xss")',
      };

      expect(() => {
        render(
          <UserAvatar
            user={userWithMaliciousImage}
            size="md"
            fallbackType="initials"
          />
        );
      }).not.toThrow();

      // Should fallback to initials instead of loading malicious URL
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should validate image URLs before loading', () => {
      const userWithInvalidImage = {
        ...mockUser,
        picture: 'not-a-valid-url',
      };

      render(
        <UserAvatar
          user={userWithInvalidImage}
          size="md"
          fallbackType="initials"
        />
      );

      // Should show fallback for invalid URLs
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('Initials Generation Contract', () => {
    it('should generate correct initials from first and last name', () => {
      render(
        <UserAvatar
          user={mockUser}
          size="md"
          fallbackType="initials"
        />
      );

      // Mock image error to trigger fallback
      const avatar = screen.getByRole('img');
      fireEvent.error(avatar);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should handle single name correctly', () => {
      const userWithSingleName = {
        ...mockUser,
        given_name: 'Madonna',
        family_name: '',
        picture: null,
      };

      render(
        <UserAvatar
          user={userWithSingleName}
          size="md"
          fallbackType="initials"
        />
      );

      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('should handle empty names by using email', () => {
      const userWithoutNames = {
        ...mockUser,
        given_name: '',
        family_name: '',
        email: 'test@example.com',
        picture: null,
      };

      render(
        <UserAvatar
          user={userWithoutNames}
          size="md"
          fallbackType="initials"
        />
      );

      expect(screen.getByText('T')).toBeInTheDocument(); // From email 'test'
    });
  });
});