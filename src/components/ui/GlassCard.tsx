import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', as = 'div', style }) => {
  const Tag = as;
  return (
    <Tag className={`glass-card rounded ${className}`} style={style}>
      {children}
    </Tag>
  );
};
