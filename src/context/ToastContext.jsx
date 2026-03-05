import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning'),
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id}
                         className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg min-w-64 max-w-sm animate-slide-in ${colors[t.type]}`}>
                        <span className="text-lg font-bold">{icons[t.type]}</span>
                        <span className="flex-1 text-sm">{t.message}</span>
                        <button onClick={() => removeToast(t.id)} className="text-white/80 hover:text-white ml-2">✕</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
