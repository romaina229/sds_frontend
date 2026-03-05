import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(form.email, form.password);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message || 'Email ou mot de passe incorrect.');
            }
        } catch {
            setError('Erreur de connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <span className="text-white font-black text-2xl">SDS</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">Administration</h1>
                    <p className="text-slate-400">Shalom Digital Solutions</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                            <input type="email" value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                required autoFocus
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="admin@shalomdigitalsolutions.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
                            <input type="password" value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all mt-2 flex items-center justify-center gap-2">
                            {loading ? (
                                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Connexion...</>
                            ) : 'Se connecter'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    <a href="/" className="hover:text-blue-400 transition-colors">← Retour au site</a>
                </p>
            </div>
        </div>
    );
}
