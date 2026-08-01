import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  bordered = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 ${
        bordered ? 'border border-emerald-900/10' : ''
      } shadow-xs ${
        hoverEffect
          ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
