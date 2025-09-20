import React from "react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
Toast.displayName = "Toast";

export interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const ToastTitle = React.forwardRef<HTMLHeadingElement, ToastTitleProps>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={className} {...props} />;
  }
);
ToastTitle.displayName = "ToastTitle";

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ToastDescription = React.forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={className} {...props} />;
  }
);
ToastDescription.displayName = "ToastDescription";

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
ToastAction.displayName = "ToastAction";