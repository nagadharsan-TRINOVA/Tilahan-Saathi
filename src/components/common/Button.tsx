import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#2E7D32] hover:bg-[#1b5e20] text-white focus:ring-[#2E7D32] border border-[#236327] shadow-sm',
    secondary:
      'bg-[#66BB6A] hover:bg-[#4caf50] text-emerald-950 font-semibold focus:ring-[#66BB6A]',
    accent:
      'bg-[#FFB300] hover:bg-[#f57f17] text-amber-950 font-semibold focus:ring-[#FFB300] shadow-sm',
    outline:
      'border border-emerald-800/20 bg-white hover:bg-emerald-50 text-emerald-900 focus:ring-[#2E7D32]',
    ghost:
      'bg-transparent hover:bg-emerald-900/10 text-emerald-900 focus:ring-emerald-700 shadow-none',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
