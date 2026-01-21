"use client";

import {
    forwardRef,
    InputHTMLAttributes,
    TextareaHTMLAttributes,
    SelectHTMLAttributes,
} from "react";

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-500" : ""} ${className}`}
                    {...props}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    },
);
Input.displayName = "Input";

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${error ? "border-red-500" : ""} ${className}`}
                    rows={4}
                    {...props}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    },
);
Textarea.displayName = "Textarea";

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-500" : ""} ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    },
);
Select.displayName = "Select";
