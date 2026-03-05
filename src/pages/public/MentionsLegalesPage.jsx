import React from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

function LegalPage({ title, children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h1 className="text-3xl font-black text-slate-800 mb-8">{title}</h1>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function MentionsLegalesPage() {
    return (
        <LegalPage title="Mentions Légales">
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Éditeur du site</h2>
                <p><strong>Shalom Digital Solutions</strong><br />
                Abomey-Calavi, Bénin<br />
                Email : <a href="mailto:liferopro@gmail.com" className="text-blue-500 hover:underline">liferopro@gmail.com</a><br />
                Téléphone : <a href="tel:+22901693517 66" className="text-blue-500 hover:underline">+229 01 69 35 17 66</a><br />
                WhatsApp : <a href="https://wa.me/22994592567" className="text-blue-500 hover:underline">+229 01 94 59 25 67</a></p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Directeur de la publication</h2>
                <p>Romain AKPO — Fondateur & Directeur Technique, Shalom Digital Solutions</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Hébergement</h2>
                <p>Ce site est hébergé sur un serveur VPS sécurisé. Les données sont stockées en conformité avec la réglementation en vigueur.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Propriété intellectuelle</h2>
                <p>L'ensemble du contenu de ce site (textes, images, graphismes, logo, code source) est la propriété exclusive de Shalom Digital Solutions et est protégé par les lois sur la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Responsabilité</h2>
                <p>Shalom Digital Solutions s'efforce de maintenir les informations de ce site à jour et exactes. Nous ne pouvons cependant garantir l'exactitude ou l'exhaustivité des informations publiées et déclinons toute responsabilité pour les dommages pouvant résulter de leur utilisation.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Loi applicable</h2>
                <p>Les présentes mentions légales sont soumises au droit béninois. Tout litige relatif à l'utilisation de ce site sera soumis à la juridiction compétente du Bénin.</p>
            </section>
        </LegalPage>
    );
}
