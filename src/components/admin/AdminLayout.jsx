import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
    { to: '/admin',              label: 'Tableau de bord',   icon: 'fas fa-chart-line',    exact: true },
    { to: '/admin/commandes',    label: 'Commandes',          icon: 'fas fa-shopping-cart' },
    { to: '/admin/services',     label: 'Services',           icon: 'fas fa-cogs' },
    { to: '/admin/certificats',  label: 'Certificats', icon: 'fas fa-certificate' },
    { to: '/admin/contacts',     label: 'Contacts',           icon: 'fas fa-envelope' },
    { to: '/admin/blog',         label: 'Blog',               icon: 'fas fa-pen-nib' },
    { to: '/admin/parametres',   label: 'Paramètres',         icon: 'fas fa-sliders-h' },
    { to: '/admin/previews',     label: 'Prévisualisations',  icon: 'fas fa-eye' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-slate-900 flex-shrink-0 flex flex-col`}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-700">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    {sidebarOpen && <span className="text-white font-bold truncate">SDS Admin</span>}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {MENU.map(item => (
                        <NavLink key={item.to} to={item.to} end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`
                            }>
                            <span className="text-lg flex-shrink-0"><i className={`${item.icon} text-sm w-4 text-center`} /></span>
                            {sidebarOpen && <span className="font-medium text-sm truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Profil */}
                <div className="p-3 border-t border-slate-700">
                    {sidebarOpen && user && (
                        <div className="flex items-center gap-2 px-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                                <div className="text-white text-sm font-medium truncate">{user.name}</div>
                                <div className="text-slate-400 text-xs truncate">{user.email}</div>
                            </div>
                        </div>
                    )}
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <span className="text-lg flex-shrink-0"><i className="fas fa-sign-out-alt text-sm" /></span>
                        {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shadow-sm">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-500 hover:text-slate-700 transition-colors text-lg">
                        ☰
                    </button>
                    <div className="flex-1" />
                    <a href="/" target="_blank" className="text-slate-500 hover:text-blue-500 text-sm font-medium flex items-center gap-1">
                        <span>🌐</span> Voir le site
                    </a>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}