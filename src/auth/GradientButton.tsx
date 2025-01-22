import React, { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  gradient: string;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  gradient,
  className = "",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`w-full h-12 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        background: gradient,
      }}
    >
      {children}
    </button>
  );
};

export default GradientButton;
