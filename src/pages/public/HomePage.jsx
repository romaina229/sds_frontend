import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { formatPriceFcfa, formatPriceEuro } from '../../utils/api';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const CATEGORIES = [
    { key: 'web',       label: 'Sites Web',           icon: 'fas fa-laptop-code',    color: 'text-blue-500' },
    { key: 'excel',     label: 'Gestion & Données',   icon: 'fas fa-table',          color: 'text-green-500' },
    { key: 'survey',    label: 'Collecte de Données', icon: 'fas fa-clipboard-list', color: 'text-orange-500' },
    { key: 'formation', label: 'Formations',           icon: 'fas fa-graduation-cap', color: 'text-purple-500' },
];

const STATS = [
    { value: '50+', label: 'Projets réalisés' },
    { value: '3', label: 'Domaines d\'expertise' },
    { value: '100%', label: 'Clients satisfaits' },
    { value: '24h', label: 'Réactivité garantie' },
];

export default function HomePage() {
    const [services, setServices] = useState({});
    const [activeTab, setActiveTab] = useState('web');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const servicesRef = useRef(null);
    const tarifsRef = useRef(null);

    useEffect(() => {
        loadAllServices();
    }, []);

    useEffect(() => {
        // Scroll to section if hash in URL
        if (location.hash) {
            setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }, [location]);

    const loadAllServices = async () => {
        try {
            const res = await api.get('/services');
            const grouped = {};
            res.data.data.forEach(s => {
                if (!grouped[s.categorie]) grouped[s.categorie] = [];
                grouped[s.categorie].push(s);
            });
            setServices(grouped);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* HERO */}
            <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                        alt="Shalom Digital Solutions"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-blue-900/60" />
                </div>

                <div className="relative z-10 container mx-auto px-6 py-24">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            Fondée en 2021 · Abomey-Calavi, Bénin bj
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            Shalom Digital
                            <span className="text-blue-400 block">Solutions</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                            Votre partenaire en <strong className="text-white">solutions numériques innovantes</strong>.
                            Nous accompagnons professionnels, ONG et organisations dans la création de sites web,
                            la gestion de données et la collecte digitale.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/commander"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg">
                                Commander un service
                            </Link>
                            <a href="#services"
                                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-sm text-lg">
                                Voir nos services
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-md border-t border-white/10">
                    <div className="container mx-auto px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {STATS.map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl font-black text-blue-400">{s.value}</div>
                                    <div className="text-white/70 text-sm">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* À PROPOS */}
            <section id="apropos" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">À propos</span>
                            <h2 className="text-4xl font-black text-slate-800 mt-2 mb-6">
                                Shalom Digital Solutions
                            </h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                Fondée en 2021, <strong>Shalom Digital Solutions</strong> est une entreprise spécialisée dans la conception
                                et la mise en œuvre de solutions numériques adaptées aux besoins des professionnels, organisations et porteurs de projets.
                            </p>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Notre expertise s'articule autour de trois domaines clés :
                            </p>
                            <div className="space-y-4 mb-8">
                                {[
                                    {
                                    icon: "fas fa-globe",
                                    title: "Création de sites web modernes",
                                    desc: "Sites vitrines, e-commerce, applications web sur mesure",
                                    },
                                    {
                                    icon: "fas fa-chart-line",
                                    title: "Gestion & analyse de données",
                                    desc: "Excel avancé, dashboards, automatisation des processus",
                                    },
                                    {
                                    icon: "fas fa-mobile-screen",
                                    title: "Collecte de données digitales",
                                    desc: "KoboToolbox, ODK, SurveyCTO pour S&E et recherche",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                    <span className="text-2xl text-blue-600">
                                        <i className={item.icon}></i>
                                    </span>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-slate-600 text-sm">{item.desc}</p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            <a href="#services" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2">
                                Voir tous nos services →
                            </a>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Équipe Shalom Digital Solutions"
                                className="rounded-2xl shadow-2xl w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-blue-500 text-white p-6 rounded-2xl shadow-xl">
                                <div className="text-3xl font-black">4+</div>
                                <div className="text-sm font-medium">Années d'expérience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" className="py-24 bg-slate-50" ref={servicesRef}>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Nos services</span>
                        <h2 className="text-4xl font-black text-slate-800 mt-2 mb-4">Services Complets</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Découvrez notre gamme complète de services numériques adaptés à tous vos besoins professionnels.
                            <br/><span className="text-sm text-slate-400">Tous les prix incluent une AIB de 5%</span>
                        </p>
                    </div>

                    {/* Onglets */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {CATEGORIES.map(cat => (
                            <button key={cat.key}
                                onClick={() => setActiveTab(cat.key)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === cat.key
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}>
                                <span><i className={`${cat.icon} ${cat.color} text-xl`} /></span> {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grille services */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-64" />)}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(services[activeTab] || []).map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* TARIFS WEB */}
            <section id="tarifs" className="py-24 bg-white" ref={tarifsRef}>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Tarifs</span>
                        <h2 className="text-4xl font-black text-slate-800 mt-2 mb-4">Tarifs Sites Web</h2>
                        <p className="text-slate-500">Choisissez la formule adaptée à votre projet</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(services['web'] || []).map((service, i) => (
                            <PricingCard key={service.id} service={service} featured={service.popular} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Prêt à démarrer votre projet ?</h2>
                    <p className="text-blue-200 mb-8 text-lg max-w-2xl mx-auto">
                        Contactez-nous pour une consultation gratuite ou passez directement votre commande.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/commander"
                            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            Commander maintenant
                        </Link>
                        <Link to="/contact"
                            className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/30 hover:bg-white/20 transition-all">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Helper : s'assurer que features est toujours un tableau
function parseFeatures(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
}

function ServiceCard({ service }) {
    const features = parseFeatures(service.features);
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 relative group">
            {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                </div>
            )}
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <i className={`${service.icone} text-blue-500 text-xl`} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 justify-center">{service.nom}</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed justify-center">{service.description}</p>

            {features.length > 0 && (
                <ul className="features-list">
                    {features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-slate-600 text-sm flex items-start gap-3 py-2 border-b border-gray-200">
                            <span className="text-green-600 font-bold mt-[1px]">✓</span> {f}
                        </li>
                    ))}
                </ul>
            )}

            <div className="border-t pt-4 mt-4">
                <div className="text-slate-400 text-xs mb-1 text-center">À partir de</div>
                <div className="text-2xl font-black text-blue-600 text-center">{formatPriceFcfa(service.ttc_fcfa)}</div>
                <div className="text-slate-400 text-sm text-center">{formatPriceEuro(service.ttc_euro)} TTC</div>
                {service.duree && <div className="text-sm mt-1 text-red-500 text-sm mt-1 text-center">Durée : {service.duree}</div>}
            </div>

            <Link to={`/commander/${service.id}`}
                className="mt-4 block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300">
                Commander
            </Link>
        </div>
    );
}

function PricingCard({ service, featured }) {
    const features = parseFeatures(service.features);
    return (
        <div className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 relative ${
            featured
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 scale-105'
                : 'bg-white border border-slate-200 hover:shadow-xl'
        }`}>
            {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-800 text-xs font-black px-4 py-1 rounded-full">
                    ⭐ Recommandé
                </div>
            )}
            <h3 className={`text-xl font-bold mb-2 ${featured ? 'text-white' : 'text-slate-800 text-center'}`}>{service.nom}</h3>
            <p className={`text-sm mb-4 ${featured ? 'text-blue-100' : 'text-slate-500 text-center'}`}>{service.description}</p>
            <div className={`text-3xl font-black mb-1 ${featured ? 'text-white' : 'text-blue-600 text-center'}`}>
                {formatPriceFcfa(service.ttc_fcfa)}
            </div>
            <div className={`text-sm mb-4 ${featured ? 'text-blue-200' : 'text-slate-400 text-center'}`}>TTC · {formatPriceEuro(service.ttc_euro)}</div>
            {service.duree && <div className={`text-sm mb-4 ${featured ? 'text-blue-100' : 'text-red-500 text-center'}`}>Durée : {service.duree}</div>}

            {features.length > 0 && (
                <ul className="features-list">
                    {features.map((f, i) => (
                        <li key={i} className={`text-sm flex items-center gap-2 ${featured ? 'text-blue-100' : 'text-slate-600'}`}>
                            <span className={featured ? 'text-yellow-300' : 'text-green-600 font-bold mt-[1px]'}>✓</span> {f}
                        </li>
                    ))}
                </ul>
            )}

            <Link to={`/commander/${service.id}`}
                className={`block text-center font-bold py-3 rounded-xl transition-all ${
                    featured
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                Commander
            </Link>
        </div>
    );
}