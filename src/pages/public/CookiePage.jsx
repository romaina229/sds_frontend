import React from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function CookiePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h1 className="text-3xl font-black text-slate-800 mb-8">Politique des Cookies</h1>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Qu'est-ce qu'un cookie ?</h2>
                            <p>Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web. Il permet au site de mémoriser certaines informations pour améliorer votre expérience.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Cookies utilisés sur ce site</h2>
                            <div className="overflow-x-auto mt-3">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="text-left p-3 rounded-tl-lg font-semibold text-slate-700">Nom</th>
                                            <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                                            <th className="text-left p-3 font-semibold text-slate-700">Durée</th>
                                            <th className="text-left p-3 rounded-tr-lg font-semibold text-slate-700">Finalité</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-mono text-blue-600">XSRF-TOKEN</td>
                                            <td className="p-3">Technique</td>
                                            <td className="p-3">Session</td>
                                            <td className="p-3">Protection sécurité (CSRF)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-blue-600">sds_session</td>
                                            <td className="p-3">Technique</td>
                                            <td className="p-3">2h</td>
                                            <td className="p-3">Gestion session utilisateur</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-blue-600">admin_token</td>
                                            <td className="p-3">Fonctionnel</td>
                                            <td className="p-3">Session</td>
                                            <td className="p-3">Authentification admin</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Cookies tiers</h2>
                            <p>Ce site n'utilise <strong>pas</strong> de cookies publicitaires, de suivi comportemental ou de cookies de réseaux sociaux. Aucune donnée de navigation n'est partagée avec des régies publicitaires.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Gérer vos préférences</h2>
                            <p>Vous pouvez désactiver les cookies à tout moment dans les paramètres de votre navigateur. Notez cependant que la désactivation des cookies essentiels peut perturber le fonctionnement du site.</p>
                            <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                                ⚠️ Les cookies de session et de sécurité sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés.
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Contact</h2>
                            <p>Pour toute question sur notre politique cookies : <a href="mailto:liferopro@gmail.com" className="text-blue-500 hover:underline">liferopro@gmail.com</a></p>
                        </section>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
