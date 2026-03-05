import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { formatPriceFcfa } from '../../utils/api';
import StatsCard from '../../components/shared/StatsCard';

const STATUT_COLORS = {
    en_attente: 'bg-orange-100 text-orange-700',
    paiement_en_cours: 'bg-blue-100 text-blue-700',
    payee: 'bg-green-100 text-green-700',
    en_cours: 'bg-purple-100 text-purple-700',
    livree: 'bg-teal-100 text-teal-700',
    annulee: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentes, setRecentes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/commandes/recentes'),
        ]).then(([statsRes, cmdRes]) => {
            setStats(statsRes.data.data);
            setRecentes(cmdRes.data.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
    );

    const STAT_CARDS = stats ? [
        { label: 'Total Commandes', value: stats.total_commandes, icon: '🛒', color: 'blue', sub: `+${stats.commandes_aujourd_hui} aujourd'hui` },
        { label: 'Revenus Total', value: formatPriceFcfa(stats.revenus_total), icon: '💰', color: 'green', sub: `${formatPriceFcfa(stats.revenus_mois)} ce mois` },
        { label: 'En attente', value: stats.commandes_en_attente, icon: '⏳', color: 'orange', sub: 'À traiter' },
        { label: 'Contacts nouveaux', value: stats.nouveaux_contacts, icon: '✉️', color: 'purple', sub: 'Non lus' },
    ] : [];

    const colorMap = { blue: 'bg-blue-500', green: 'bg-green-500', orange: 'bg-orange-500', purple: 'bg-purple-500' };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">Tableau de bord</h1>
                <p className="text-slate-500">Aperçu de votre activité</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 ${colorMap[card.color]} rounded-xl flex items-center justify-center text-lg`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-800 mb-1">{card.value}</div>
                        <div className="text-slate-500 text-sm font-medium">{card.label}</div>
                        <div className="text-slate-400 text-xs mt-1">{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Commandes récentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Commandes récentes</h2>
                    <Link to="/admin/commandes" className="text-blue-500 hover:underline text-sm font-medium">
                        Voir tout →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="text-left px-5 py-3">N° Commande</th>
                                <th className="text-left px-5 py-3">Client</th>
                                <th className="text-left px-5 py-3">Service</th>
                                <th className="text-left px-5 py-3">Montant</th>
                                <th className="text-left px-5 py-3">Paiement</th>
                                <th className="text-left px-5 py-3">Statut</th>
                                <th className="text-left px-5 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentes.map(cmd => (
                                <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <Link to={`/admin/commandes/${cmd.id}`}
                                            className="font-mono text-sm text-blue-600 hover:underline font-bold">
                                            {cmd.numero_commande}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-slate-700 text-sm">{cmd.client_nom}</div>
                                        <div className="text-slate-400 text-xs">{cmd.client_email}</div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-600 text-sm">{cmd.service_nom}</td>
                                    <td className="px-5 py-3 font-bold text-slate-700 text-sm">{cmd.montant_format}</td>
                                    <td className="px-5 py-3 text-slate-500 text-xs">{cmd.methode_paiement}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${STATUT_COLORS[cmd.statut] || 'bg-slate-100 text-slate-600'}`}>
                                            {cmd.statut_info?.label || cmd.statut}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">{cmd.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentes.length === 0 && (
                        <div className="text-center py-12 text-slate-400">Aucune commande pour le moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
