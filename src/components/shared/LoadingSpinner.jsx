import React from 'react';

export default function LoadingSpinner({ size = 'md', text = null, fullPage = false }) {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div className={`${sizes[size]} rounded-full border-blue-500 border-t-transparent animate-spin`} />
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
}
