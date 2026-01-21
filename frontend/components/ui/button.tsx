"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            isLoading,
            className = "",
            disabled,
            ...props
        },
        ref,
    ) => {
        const baseClasses =
            "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

        const variantClasses = {
            primary:
                "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90 shadow-lg shadow-blue-500/20",
            secondary:
                "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600",
            danger: "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
            ghost: "text-slate-400 hover:text-white hover:bg-slate-800",
        };

        const sizeClasses = {
            sm: "px-3 py-2 text-sm",
            md: "px-4 py-3 text-sm",
            lg: "px-6 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    },
);
Button.displayName = "Button";
