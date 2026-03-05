import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="animate-spin w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
