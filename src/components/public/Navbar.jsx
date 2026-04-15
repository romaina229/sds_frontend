import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        if (isHome) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = `/#${id}`;
        }
    };

    const navClass = scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
        : 'bg-transparent';

    const textClass = scrolled || !isHome ? 'text-slate-700' : 'text-white';
    const hoverClass = scrolled || !isHome ? 'hover:text-blue-500' : 'hover:text-blue-300';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/images/Logosds.png" alt="SDS" className="h-20 w-auto"
                            onError={e => e.target.style.display = 'none'} />
                        <span className={`font-black text-lg ${textClass}`}>
                            Shalom Digital <span className="text-blue-500">Solutions</span>
                        </span>
                    </Link>

                    {/* Menu desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {[
                            { label: 'Accueil', action: () => scrollTo('accueil') },
                            { label: 'À propos', action: () => scrollTo('apropos') },
                            { label: 'Services', action: () => scrollTo('services') },
                            { label: 'Tarifs', action: () => scrollTo('tarifs') },
                            { label: 'Blog', href: '/blog' },
                            { label: 'Contact', href: '/contact' },
                        ].map((item, i) => (
                            item.href
                                ? <Link key={i} to={item.href} className={`font-medium transition-colors ${textClass} ${hoverClass}`}>{item.label}</Link>
                                : <button key={i} onClick={item.action} className={`font-medium transition-colors ${textClass} ${hoverClass}`}>{item.label}</button>
                        ))}
                        <Link to="/commander"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5">
                            Commander
                        </Link>
                    </div>

                    {/* Burger */}
                    <button onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${textClass}`}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Menu mobile */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 py-4 space-y-2 shadow-lg rounded-b-2xl">
                        {['accueil', 'apropos', 'services', 'tarifs'].map(id => (
                            <button key={id} onClick={() => scrollTo(id)}
                                className="block w-full text-left px-6 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500 capitalize transition-colors">
                                {id === 'apropos' ? 'À propos' : id.charAt(0).toUpperCase() + id.slice(1)}
                            </button>
                        ))}
                        <Link to="/blog" onClick={() => setMenuOpen(false)} className="block px-6 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500">Blog</Link>
                        <Link to="/contact" onClick={() => setMenuOpen(false)} className="block px-6 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500">Contact</Link>
                        <div className="px-6 pt-2">
                            <Link to="/commander" onClick={() => setMenuOpen(false)}
                                className="block text-center bg-blue-500 text-white font-bold py-3 rounded-xl">
                                Commander
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
