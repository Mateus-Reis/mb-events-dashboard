import React, { ReactNode } from "react";

interface GradientProps {
  children: ReactNode;
  colors: [string, string, string];
}

const Gradient: React.FC<GradientProps> = ({ children, colors }) => {
  return (
    <div
      className={`bg-gradient-to-r from-[${colors[0]}] via-[${colors[1]}] to-[${colors[2]}] bg-clip-text text-transparent`}
    >
      {children}
    </div>
  );
};

export default Gradient;
