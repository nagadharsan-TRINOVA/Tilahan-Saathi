import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'red' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    red: 'bg-rose-100 text-rose-800 border-rose-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
