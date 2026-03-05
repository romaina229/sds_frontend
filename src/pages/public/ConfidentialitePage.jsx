import React from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h1 className="text-3xl font-black text-slate-800 mb-8">Politique de Confidentialité</h1>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Responsable du traitement</h2>
                            <p><strong>Shalom Digital Solutions</strong> — Abomey-Calavi, Bénin<br />
                            Contact DPO : <a href="mailto:liferopro@gmail.com" className="text-blue-500 hover:underline">liferopro@gmail.com</a></p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Données collectées</h2>
                            <p>Nous collectons uniquement les données strictement nécessaires :</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                                <li>Nom et prénom</li>
                                <li>Adresse email</li>
                                <li>Numéro de téléphone</li>
                                <li>Nom de l'entreprise / organisation (optionnel)</li>
                                <li>Description du projet (optionnel)</li>
                            </ul>
                            <p className="mt-3">Nous ne collectons <strong>jamais</strong> de données bancaires. Les paiements sont traités directement par nos prestataires certifiés (FedaPay, CinetPay).</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Finalités du traitement</h2>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Traitement et suivi des commandes</li>
                                <li>Communication relative à l'exécution de nos services</li>
                                <li>Réponse aux demandes de contact</li>
                                <li>Émission des factures</li>
                                <li>Amélioration de nos services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Conservation des données</h2>
                            <p>Vos données sont conservées pendant la durée nécessaire à l'exécution de nos services et conformément aux obligations légales applicables (5 ans pour les données comptables).</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Partage des données</h2>
                            <p>Vos données ne sont <strong>jamais vendues ni cédées</strong> à des tiers à des fins commerciales. Elles peuvent être transmises à nos prestataires techniques (hébergement, paiement) dans le strict cadre de l'exécution de nos services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Vos droits</h2>
                            <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants :</p>
                            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                                <li>Droit d'accès à vos données</li>
                                <li>Droit de rectification</li>
                                <li>Droit d'effacement (droit à l'oubli)</li>
                                <li>Droit à la portabilité</li>
                                <li>Droit d'opposition au traitement</li>
                            </ul>
                            <p className="mt-3">Pour exercer ces droits, contactez-nous à : <a href="mailto:liferopro@gmail.com" className="text-blue-500 hover:underline">liferopro@gmail.com</a></p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Sécurité</h2>
                            <p>Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.</p>
                        </section>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
