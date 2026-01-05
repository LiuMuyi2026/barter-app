import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    neonBorder?: boolean;
}

export function GlassCard({ children, className = '', neonBorder = false, ...props }: GlassCardProps) {
    return (
        <div
            className={`glass-card p-6 ${neonBorder ? 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
