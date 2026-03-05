import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function PaiementAnnulePage() {
    const { numero } = useParams();

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
                <div className="container mx-auto px-6 max-w-lg text-center">
                    <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 mb-3">Paiement annulé</h1>
                        <p className="text-slate-500 mb-6">
                            Vous avez annulé le processus de paiement.<br />
                            Votre commande <strong className="text-slate-700">{numero}</strong> a été conservée mais reste en attente de paiement.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-700 text-left">
                            <strong>Aucun montant n'a été débité.</strong><br />
                            Vous pouvez réessayer à tout moment en utilisant le même numéro de commande ou en passant une nouvelle commande.
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to="/commander"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all">
                                Nouvelle commande
                            </Link>
                            <Link to="/"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all">
                                Retour à l'accueil
                            </Link>
                        </div>
                        <p className="mt-6 text-slate-400 text-sm">
                            Un problème ? Contactez-nous :<br />
                            <a href="https://wa.me/22994592567" className="text-blue-500 hover:underline">WhatsApp +229 01 94 59 25 67</a> ·{' '}
                            <a href="mailto:liferopro@gmail.com" className="text-blue-500 hover:underline">liferopro@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
