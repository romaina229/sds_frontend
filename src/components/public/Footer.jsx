import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid md:grid-cols-4 gap-10 mb-12">

                    {/* Entreprise */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/images/Logosds.png" alt="SDS" className="h-14 w-auto"
                                onError={e => e.target.style.display = 'none'} />
                            <span className="font-black text-white">Shalom Digital <span className="text-blue-400">Solutions</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5">
                            Votre partenaire en solutions numériques. Nous accompagnons professionnels,
                            ONG et organisations dans leurs projets digitaux.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com', color: 'hover:bg-blue-600' },
                                { icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/in/romain-akpo-2ab8802a8', color: 'hover:bg-blue-700' },
                                { icon: 'fab fa-youtube', href: 'http://www.youtube.com/@lifero5180', color: 'hover:bg-red-500' },
                                { icon: 'fab fa-whatsapp', href: 'https://wa.me/22994592567', color: 'hover:bg-green-500' },
                            ].map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                                    className={`w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 transition-all hover:text-white ${s.color}`}>
                                    <i className={`${s.icon} text-sm`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Sites Web', icon: 'fas fa-globe', href: '/#services' },
                                { label: 'Gestion de données', icon: 'fas fa-database', href: '/#services' },
                                { label: 'Collecte de données', icon: 'fas fa-clipboard-list', href: '/#services' },
                                { label: 'Formations', icon: 'fas fa-graduation-cap', href: '/#services' },
                                { label: 'Matériels & Maintenance', icon: 'fas fa-desktop', href: '/#services' },
                                { label: 'Tarifs', icon: 'fas fa-money-bill-wave', href: '/#tarifs' },
                            ].map((l, i) => (
                                <li key={i}>
                                <a
                                    href={l.href}
                                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    <i className={l.icon}></i>
                                    {l.label}
                                </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Accueil', to: '/' },
                                { label: 'Commander', to: '/commander' },
                                { label: 'Blog', to: '/blog' },
                                { label: 'Contact', to: '/contact' },
                                { label: 'Mentions légales', to: '/mentions-legales' },
                                { label: 'Confidentialité', to: '/confidentialite' },
                                { label: 'Politique cookies', to: '/cookies' },
                                { label: 'Administration', to: '/admin' },
                            ].map((l, i) => (
                                <li key={i}><Link to={l.to} className="text-slate-400 hover:text-blue-400 transition-colors">{l.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { icon: <i className="fas fa-map-marker-alt"></i>, text: 'Abomey-Calavi, Bénin', href: null },
                                { icon: <i className="fas fa-phone"></i>, text: '+229 01 69 35 17 66', href: 'tel:+22901693517 66' },
                                { icon: <i className="fas fa-mobile-alt"></i>, text: '+229 01 94 59 25 67', href: 'tel:+22901945 92567' },
                                { icon: <i className="fas fa-envelope"></i>, text: 'liferopro@gmail.com', href: 'mailto:liferopro@gmail.com' },
                                { icon: <i className="fas fa-clock"></i>, text: 'Lun-Ven: 9h-18h | Sam: 9h-13h', href: null },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span>{item.icon}</span>
                                    {item.href
                                        ? <a href={item.href} className="text-slate-400 hover:text-blue-400 transition-colors">{item.text}</a>
                                        : <span className="text-slate-400">{item.text}</span>
                                    }
                                </li>
                            ))}
                        </ul>
                        <Link to="/contact"
                            className="mt-4 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm">
                            <i className="fas fa-paper-plane"></i> Nous écrire
                        </Link>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-slate-500">
                    <p>© {year} Shalom Digital Solutions. Tous droits réservés.</p>
                    <p>Développé avec ❤️ au Bénin</p>
                </div>
            </div>
        </footer>
    );
}