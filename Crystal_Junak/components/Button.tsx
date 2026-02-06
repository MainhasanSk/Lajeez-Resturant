'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    icon?: ReactNode;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    icon
}: ButtonProps) {

    const baseStyles = "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans tracking-widest uppercase transition-colors duration-300";

    const variants = {
        primary: "bg-white text-black hover:bg-cj-secondary hover:text-black shadow-lg hover:shadow-cj-secondary/20",
        secondary: "bg-cj-primary text-white hover:bg-cj-supporting shadow-lg",
        outline: "border border-white/30 text-white hover:bg-white hover:text-black hover:border-white",
        ghost: "text-white/70 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-6 py-2 text-xs",
        md: "px-8 py-3 text-xs font-bold",
        lg: "px-10 py-4 text-sm font-bold"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {icon && <span className="ml-1">{icon}</span>}
            </span>
        </motion.button>
    );
}
