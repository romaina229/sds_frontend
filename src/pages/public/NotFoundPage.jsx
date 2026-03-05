import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
                <div className="container mx-auto px-6 max-w-2xl text-center">

                    {/* Illustration */}
                    <div className="relative mb-8">
                        <div className="text-[10rem] font-black text-slate-100 select-none leading-none">404</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-3xl">🔍</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 mb-3">Page introuvable</h1>
                    <p className="text-slate-500 mb-10 max-w-md mx-auto">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                        Revenez à l'accueil pour continuer.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md">
                            🏠 Retour à l'accueil
                        </Link>
                        <button onClick={() => navigate(-1)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3 rounded-xl transition-all">
                            ← Page précédente
                        </button>
                        <Link to="/contact"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-xl transition-all">
                            Nous contacter
                        </Link>
                    </div>

                    {/* Liens rapides */}
                    <div className="mt-16 pt-8 border-t border-slate-200">
                        <p className="text-slate-400 text-sm mb-4">Vous cherchez peut-être :</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                { to: '/commander', label: '🛒 Commander un service' },
                                { to: '/blog', label: '📝 Notre blog' },
                                { to: '/contact', label: '✉️ Contact' },
                            ].map(link => (
                                <Link key={link.to} to={link.to}
                                    className="bg-white border border-slate-200 text-slate-600 hover:text-blue-500 hover:border-blue-300 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
