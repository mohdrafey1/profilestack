"use client";

import { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface CardProps {
    children: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function Card({
    children,
    onEdit,
    onDelete,
    className = "",
}: CardProps) {
    return (
        <div
            className={`group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all ${className}`}
        >
            <div className="flex justify-between gap-4">
                <div className="flex-1 min-w-0">{children}</div>
                {(onEdit || onDelete) && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Empty state component
interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}
