/**
 * AuthButton Contract Test
 * 
 * This test defines the expected interface and behavior of the AuthButton component.
 * It should fail initially and pass only when the component is implemented correctly.
 * 
 * Constitutional Requirements:
 * - Uses shadcn/ui Button component only
 * - WCAG 2.1 AA accessibility compliance  
 * - Widget-centric architecture with reusability
 * - Kinde authentication integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuthButton } from '@/components/AuthButton';

// Mock Kinde auth
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  logout: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
};

jest.mock('@kinde-oss/kinde-auth-nextjs', () => ({
  useKindeAuth: () => mockAuthContext,
}));

describe('AuthButton Contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Interface', () => {
    it('should accept required props with correct types', () => {
      expect(() => {
        render(
          <AuthButton
            mode="signin"
            onSuccess={() => {}}
            onError={() => {}}
          />
        );
      }).not.toThrow();
    });

    it('should accept optional props with correct types', () => {
      expect(() => {
        render(
          <AuthButton
            mode="signup"
            variant="outline"
            size="lg"
            text="Custom Sign Up"
            loadingText="Signing up..."
            disabled={false}
            className="custom-auth-button"
            onSuccess={() => {}}
            onError={() => {}}
            onLoadingStateChange={() => {}}
          />
        );
      }).not.toThrow();
    });

    it('should handle mode switching', () => {
      const { rerender } = render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

      rerender(
        <AuthButton
          mode="signup"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('Rendering Contract', () => {
    it('should display correct text for signin mode', () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should display correct text for signup mode', () => {
      render(
        <AuthButton
          mode="signup"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should display custom text when provided', () => {
      render(
        <AuthButton
          mode="signin"
          text="Custom Login"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /custom login/i })).toBeInTheDocument();
    });

    it('should show loading state with spinner', () => {
      const loadingContext = {
        ...mockAuthContext,
        isLoading: true,
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(loadingContext);

      render(
        <AuthButton
          mode="signin"
          loadingText="Signing in..."
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('should apply different variants correctly', () => {
      const { rerender } = render(
        <AuthButton
          mode="signin"
          variant="default"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary'); // shadcn/ui default button style

      rerender(
        <AuthButton
          mode="signin"
          variant="outline"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(button).toHaveClass('border'); // shadcn/ui outline button style
    });

    it('should apply different sizes correctly', () => {
      const { rerender } = render(
        <AuthButton
          mode="signin"
          size="default"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10'); // shadcn/ui default button height

      rerender(
        <AuthButton
          mode="signin"
          size="lg"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      expect(button).toHaveClass('h-11'); // shadcn/ui large button height
    });
  });

  describe('Interaction Contract', () => {
    it('should call Kinde login on signin button click', async () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledTimes(1);
      });
    });

    it('should call Kinde register on signup button click', async () => {
      render(
        <AuthButton
          mode="signup"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAuthContext.register).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onSuccess when authentication succeeds', async () => {
      const onSuccess = jest.fn();
      const successContext = {
        ...mockAuthContext,
        user: { id: 'user-123', email: 'test@example.com' },
        isAuthenticated: true,
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(successContext);

      render(
        <AuthButton
          mode="signin"
          onSuccess={onSuccess}
          onError={() => {}}
        />
      );

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(successContext.user);
      });
    });

    it('should call onError when authentication fails', async () => {
      const onError = jest.fn();
      const mockError = new Error('Authentication failed');
      
      mockAuthContext.login.mockRejectedValue(mockError);

      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={onError}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(mockError);
      });
    });

    it('should call onLoadingStateChange during auth flow', async () => {
      const onLoadingStateChange = jest.fn();

      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
          onLoadingStateChange={onLoadingStateChange}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(button);

      expect(onLoadingStateChange).toHaveBeenCalledWith(true);
    });

    it('should not trigger auth when disabled', () => {
      render(
        <AuthButton
          mode="signin"
          disabled={true}
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(mockAuthContext.login).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Contract', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      
      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();

      // Should activate on Enter
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockAuthContext.login).toHaveBeenCalled();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should announce loading state to screen readers', () => {
      const loadingContext = {
        ...mockAuthContext,
        isLoading: true,
      };

      jest.mocked(require('@kinde-oss/kinde-auth-nextjs').useKindeAuth).mockReturnValue(loadingContext);

      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Responsive Contract', () => {
    it('should adapt to different screen sizes', () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toHaveClass('px-4'); // Responsive padding
    });
  });

  describe('Widget Integration Contract', () => {
    it('should integrate with widget system', () => {
      const widgetProps = {
        widgetId: 'auth-button-1',
        title: 'Authentication',
        refreshable: false,
        configurable: true,
      };

      expect(() => {
        render(
          <AuthButton
            mode="signin"
            onSuccess={() => {}}
            onError={() => {}}
            {...widgetProps}
          />
        );
      }).not.toThrow();
    });

    it('should support webhook data integration', () => {
      const webhookData = {
        authProvider: 'kinde',
        redirectUrl: '/dashboard',
        theme: 'dark',
      };

      expect(() => {
        render(
          <AuthButton
            mode="signin"
            webhookData={webhookData}
            onSuccess={() => {}}
            onError={() => {}}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Security Contract', () => {
    it('should not expose sensitive auth data', () => {
      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      
      // Should not contain sensitive data in DOM
      expect(button.outerHTML).not.toContain('api_key');
      expect(button.outerHTML).not.toContain('secret');
      expect(button.outerHTML).not.toContain('token');
    });

    it('should handle auth errors gracefully without exposing details', async () => {
      const onError = jest.fn();
      const sensitiveError = new Error('API_KEY_INVALID: sk_live_abcd1234');
      
      mockAuthContext.login.mockRejectedValue(sensitiveError);

      render(
        <AuthButton
          mode="signin"
          onSuccess={() => {}}
          onError={onError}
        />
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.not.stringContaining('sk_live_')
          })
        );
      });
    });
  });
});