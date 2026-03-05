import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api, { formatPriceFcfa } from '../../utils/api';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function PaiementSuccesPage() {
    const { numero } = useParams();
    const location = useLocation();
    const [commande, setCommande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [polling, setPolling] = useState(false);

    // Si c'est un retour virement, on a les données dans le state
    const virementData = location.state?.virement;
    const instructions = location.state?.instructions;

    useEffect(() => {
        // Vérifier le statut (avec retry si paiement en cours)
        verifierStatut();
    }, []);

    const verifierStatut = async (attempt = 0) => {
        try {
            setPolling(true);
            const res = await api.get(`/commandes/${numero}/statut`);
            const data = res.data;

            if (data.est_payee || virementData) {
                // Récupérer les détails complets
                const resSucces = await api.get(`/paiement/succes/${numero}`);
                setCommande(resSucces.data.commande);
                setLoading(false);
                setPolling(false);
            } else if (data.statut === 'paiement_en_cours' && attempt < 10) {
                // Attendre et retry (jusqu'à 30 secondes)
                setTimeout(() => verifierStatut(attempt + 1), 3000);
            } else {
                setCommande({ statut: data.statut, numero_commande: numero });
                setLoading(false);
                setPolling(false);
            }
        } catch {
            setLoading(false);
            setPolling(false);
        }
    };

    const telechargerFacture = async () => {
        setDownloading(true);
        try {
            const response = await api.get(`/commandes/${numero}/facture`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Facture-${numero}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            alert('Erreur lors du téléchargement de la facture.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent mb-4" />
                    <p className="text-slate-600">
                        {polling ? 'Vérification du paiement en cours...' : 'Chargement...'}
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    const isPayee = commande?.est_payee || virementData;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-2xl">

                    {/* Virement bancaire */}
                    {virementData && instructions && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🏦</span>
                                </div>
                                <h1 className="text-2xl font-black text-slate-800">Commande enregistrée !</h1>
                                <p className="text-slate-500 mt-2">Procédez au virement bancaire pour finaliser votre commande.</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-blue-800 mb-3">Coordonnées bancaires</h3>
                                <div className="space-y-2 text-sm">
                                    {[
                                        ['Bénéficiaire', instructions.titulaire],
                                        ['Banque', instructions.banque],
                                        ['RIB / IBAN', instructions.rib],
                                        ['SWIFT / BIC', instructions.swift],
                                        ['Montant', formatPriceFcfa(instructions.montant)],
                                        ['Référence obligatoire', instructions.reference],
                                    ].map(([l, v]) => (
                                        <div key={l} className="flex justify-between">
                                            <span className="text-slate-500">{l} :</span>
                                            <span className="font-bold text-slate-800 text-right">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                                ⚠️ Mentionnez impérativement la référence <strong>{instructions.reference}</strong> dans votre virement.
                                Envoyez le justificatif à <strong>{instructions.email_notification}</strong>
                            </div>
                        </div>
                    )}

                    {/* Paiement réussi */}
                    {isPayee && !virementData && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">✅</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-800">Paiement réussi !</h1>
                                <p className="text-slate-500 mt-2">Votre commande a été confirmée avec succès.</p>
                            </div>

                            {commande && (
                                <div className="bg-slate-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
                                    {[
                                        ['Numéro de commande', commande.numero_commande],
                                        ['Service', commande.service_nom],
                                        ['Client', commande.client_nom],
                                        ['Durée estimée', commande.duree_estimee],
                                        ['Montant HT', formatPriceFcfa(commande.montant_fcfa)],
                                        ['AIB (5%)', formatPriceFcfa(commande.tva_fcfa)],
                                        ['Total TTC', formatPriceFcfa(commande.total_ttc_fcfa)],
                                        ['Méthode', commande.methode_paiement_label],
                                        ['Date paiement', commande.paiement_at],
                                    ].filter(([,v]) => v).map(([l, v]) => (
                                        <div key={l} className={`flex justify-between ${l === 'Total TTC' ? 'font-black text-blue-700 text-base border-t pt-3' : ''}`}>
                                            <span className="text-slate-500">{l} :</span>
                                            <span className="font-medium text-slate-800">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Télécharger facture */}
                            <button onClick={telechargerFacture}
                                disabled={downloading}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg mb-4">
                                {downloading ? (
                                    <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Téléchargement...</>
                                ) : (
                                    <><span>📄</span> Télécharger la facture PDF</>
                                )}
                            </button>

                            <p className="text-center text-slate-500 text-sm mb-6">
                                Un email de confirmation a été envoyé à <strong>{commande?.client_email}</strong>.<br/>
                                Notre équipe vous contactera dans les 24h pour démarrer votre projet.
                            </p>
                        </div>
                    )}

                    {/* Paiement échoué ou en attente */}
                    {!isPayee && commande?.statut === 'annulee' && (
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className="text-5xl mb-4">❌</div>
                            <h1 className="text-2xl font-black text-red-600 mb-2">Paiement non abouti</h1>
                            <p className="text-slate-500 mb-6">Votre paiement n'a pas pu être traité. Aucun montant n'a été débité.</p>
                            <Link to="/commander" className="bg-blue-500 text-white font-bold px-8 py-3 rounded-xl inline-block">
                                Réessayer
                            </Link>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6 justify-center">
                        <Link to="/" className="text-slate-500 hover:text-slate-700 font-semibold">← Retour à l'accueil</Link>
                        <Link to="/commander" className="text-blue-500 hover:text-blue-600 font-semibold">Nouvelle commande →</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
