import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { formatPriceFcfa, formatPriceEuro } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const STATUTS = ['en_attente', 'paiement_en_cours', 'payee', 'en_cours', 'livree', 'annulee'];
const STATUT_LABELS = {
    en_attente: 'En attente', paiement_en_cours: 'Paiement en cours',
    payee: 'Payée', en_cours: 'En cours', livree: 'Livrée', annulee: 'Annulée',
};
const STATUT_COLORS = {
    en_attente: 'bg-orange-100 text-orange-700', paiement_en_cours: 'bg-blue-100 text-blue-700',
    payee: 'bg-green-100 text-green-700', en_cours: 'bg-purple-100 text-purple-700',
    livree: 'bg-teal-100 text-teal-700', annulee: 'bg-red-100 text-red-700',
};

export default function AdminCommandeDetail() {
    const { id } = useParams();
    const [commande, setCommande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatut, setUpdatingStatut] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // On charge via la liste admin et on filtre
        api.get('/admin/commandes', { params: { page: 1 } }).then(res => {
            // Si on a l'id, on récupère le détail
            api.get(`/admin/commandes?search=${id}`).then(() => {}).catch(() => {});
        });
        // Pour l'instant on charge via le statut public
        api.get(`/commandes/${id}/statut`).catch(() => {});
        loadCommande();
    }, [id]);

    const loadCommande = async () => {
        try {
            // Récupération via la liste admin filtrée par id
            const res = await api.get('/admin/commandes', { params: { page: 1 } });
            // Chercher dans les résultats
            const found = res.data.data?.find(c => String(c.id) === String(id));
            if (found) {
                setCommande(found);
            } else {
                // Recherche plus large
                const res2 = await api.get('/admin/commandes', { params: { search: id, page: 1 } });
                setCommande(res2.data.data?.[0] || null);
            }
        } catch {
            toast.error('Commande introuvable.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatut = async (newStatut) => {
        setUpdatingStatut(true);
        try {
            await api.patch(`/admin/commandes/${id}/statut`, { statut: newStatut });
            setCommande(prev => ({ ...prev, statut: newStatut }));
            toast.success('Statut mis à jour.');
        } catch {
            toast.error('Erreur mise à jour.');
        } finally {
            setUpdatingStatut(false);
        }
    };

    const downloadFacture = async () => {
        if (!commande?.numero_commande) return;
        setDownloading(true);
        try {
            const res = await api.get(`/commandes/${commande.numero_commande}/facture`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Facture-${commande.numero_commande}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error('Facture indisponible (commande non payée ou erreur).');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center pt-20">
            <div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
    );

    if (!commande) return (
        <div className="text-center py-20">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-slate-500 mb-4">Commande introuvable.</p>
            <Link to="/admin/commandes" className="text-blue-500 hover:underline">← Retour aux commandes</Link>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/commandes" className="text-slate-400 hover:text-slate-600 transition-colors">←</Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">{commande.numero_commande}</h1>
                        <p className="text-slate-400 text-sm">{commande.created_at}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${STATUT_COLORS[commande.statut]}`}>
                        {STATUT_LABELS[commande.statut]}
                    </span>
                    {commande.statut === 'payee' || commande.statut === 'en_cours' || commande.statut === 'livree' ? (
                        <button onClick={downloadFacture} disabled={downloading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 disabled:bg-slate-300">
                            {downloading ? 'Téléchargement...' : '📄 Facture PDF'}
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Infos principales */}
                <div className="md:col-span-2 space-y-6">

                    {/* Service */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">🔧 Service commandé</h2>
                        <div className="space-y-3 text-sm">
                            <Row label="Service" value={commande.service_nom} bold />
                            <Row label="Durée estimée" value={commande.duree_estimee} />
                            <Row label="Méthode de paiement" value={commande.methode_paiement} />
                        </div>
                        {/* Récapitulatif financier */}
                        <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                            <Row label="Montant HT" value={formatPriceFcfa(commande.montant_fcfa)} />
                            <Row label="AIB (5%)" value={formatPriceFcfa(commande.tva_fcfa)} />
                            <div className="flex justify-between font-black text-base text-blue-700 pt-2 border-t border-slate-200">
                                <span>Total TTC</span>
                                <span>{formatPriceFcfa(commande.total_ttc_fcfa)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">👤 Informations client</h2>
                        <div className="space-y-3 text-sm">
                            <Row label="Nom" value={commande.client_nom} bold />
                            <Row label="Email" value={
                                <a href={`mailto:${commande.client_email}`} className="text-blue-500 hover:underline">{commande.client_email}</a>
                            } />
                            <Row label="Téléphone" value={
                                <a href={`tel:${commande.client_telephone}`} className="text-blue-500 hover:underline">{commande.client_telephone}</a>
                            } />
                            {commande.client_entreprise && <Row label="Entreprise" value={commande.client_entreprise} />}
                            {commande.message && (
                                <div>
                                    <div className="text-slate-400 mb-1">Description du projet :</div>
                                    <div className="bg-slate-50 rounded-xl p-3 text-slate-600 text-sm leading-relaxed">{commande.message}</div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar actions */}
                <div className="space-y-6">
                    {/* Changer statut */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4">Statut de la commande</h2>
                        <div className="space-y-2">
                            {STATUTS.map(s => (
                                <button key={s} onClick={() => updateStatut(s)}
                                    disabled={updatingStatut || commande.statut === s}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        commande.statut === s
                                            ? `${STATUT_COLORS[s]} cursor-default`
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}>
                                    {commande.statut === s ? '✓ ' : ''}{STATUT_LABELS[s]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contacts rapides */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4">Actions rapides</h2>
                        <div className="space-y-2">
                            <a href={`mailto:${commande.client_email}?subject=Votre commande ${commande.numero_commande}`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all">
                                ✉️ Envoyer un email
                            </a>
                            <a href={`https://wa.me/${commande.client_telephone?.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-all">
                                💬 WhatsApp
                            </a>
                            <a href={`tel:${commande.client_telephone}`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
                                📞 Appeler
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, bold = false }) {
    return (
        <div className="flex justify-between items-start gap-4">
            <span className="text-slate-400 flex-shrink-0">{label} :</span>
            <span className={`text-right ${bold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{value || '-'}</span>
        </div>
    );
}
