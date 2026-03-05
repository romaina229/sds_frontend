// resources/js/pages/admin/AdminCommandes.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { formatPriceFcfa } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import useDebounce from '../../hooks/useDebounce';

const STATUTS = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'paiement_en_cours', label: 'Paiement en cours' },
    { value: 'payee', label: 'Payée' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' },
];

const STATUT_COLORS = {
    en_attente: 'bg-orange-100 text-orange-700',
    paiement_en_cours: 'bg-blue-100 text-blue-700',
    payee: 'bg-green-100 text-green-700',
    en_cours: 'bg-purple-100 text-purple-700',
    livree: 'bg-teal-100 text-teal-700',
    annulee: 'bg-red-100 text-red-700',
};

export default function AdminCommandes() {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statut, setStatut] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, last_page: 1 });
    const toast = useToast();
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        loadCommandes();
    }, [debouncedSearch, statut, page]);

    const loadCommandes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/commandes', { params: { search: debouncedSearch, statut, page } });
            setCommandes(res.data.data);
            setMeta(res.data.meta);
        } catch { toast.error('Erreur de chargement.'); }
        finally { setLoading(false); }
    };

    const updateStatut = async (id, newStatut) => {
        try {
            await api.patch(`/admin/commandes/${id}/statut`, { statut: newStatut });
            toast.success('Statut mis à jour.');
            loadCommandes();
        } catch { toast.error('Erreur mise à jour.'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-slate-800">Commandes</h1>
                <span className="text-slate-500 text-sm">{meta.total} commande(s)</span>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-2xl p-4 mb-6 flex flex-wrap gap-3 border border-slate-100 shadow-sm">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Rechercher (nom, email, n° commande)..."
                    className="flex-1 min-w-48 px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
                <select value={statut} onChange={e => { setStatut(e.target.value); setPage(1); }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
                    {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-5 py-3">N° Commande</th>
                                <th className="text-left px-5 py-3">Client</th>
                                <th className="text-left px-5 py-3">Service</th>
                                <th className="text-left px-5 py-3">Montant</th>
                                <th className="text-left px-5 py-3">Paiement</th>
                                <th className="text-left px-5 py-3">Statut</th>
                                <th className="text-left px-5 py-3">Date</th>
                                <th className="text-left px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-400">Chargement...</td></tr>
                            ) : commandes.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-400">Aucune commande trouvée.</td></tr>
                            ) : commandes.map(cmd => (
                                <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <Link to={`/admin/commandes/${cmd.id}`}
                                            className="font-mono font-bold text-blue-600 hover:underline text-sm">{cmd.numero_commande}</Link>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-slate-700 text-sm">{cmd.client_nom}</div>
                                        <div className="text-slate-400 text-xs">{cmd.client_email}</div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-600 text-sm max-w-32 truncate">{cmd.service_nom}</td>
                                    <td className="px-5 py-3 font-bold text-sm text-slate-700">{formatPriceFcfa(cmd.total_ttc_fcfa)}</td>
                                    <td className="px-5 py-3 text-slate-500 text-xs">{cmd.methode_paiement}</td>
                                    <td className="px-5 py-3">
                                        <select value={cmd.statut}
                                            onChange={e => updateStatut(cmd.id, e.target.value)}
                                            className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer ${STATUT_COLORS[cmd.statut]}`}>
                                            {STATUTS.filter(s => s.value).map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">{cmd.created_at}</td>
                                    <td className="px-5 py-3">
                                        <Link to={`/admin/commandes/${cmd.id}`}
                                            className="text-blue-500 hover:underline text-xs font-medium">Détail</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                    p === page ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
