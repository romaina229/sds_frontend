import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function BlogArticlePage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get(`/blog/${slug}`)
            .then(res => setArticle(res.data.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
            <Footer />
        </div>
    );

    if (error || !article) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 text-center py-20">
                <div className="text-5xl mb-4">😕</div>
                <h1 className="text-2xl font-black text-slate-700 mb-4">Article introuvable</h1>
                <Link to="/blog" className="bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all inline-block">
                    ← Retour au blog
                </Link>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-3xl">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                        <Link to="/" className="hover:text-blue-500 transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link to="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-slate-600 truncate">{article.titre}</span>
                    </div>

                    {/* Article */}
                    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {article.image && (
                            <img src={article.image} alt={article.titre}
                                className="w-full h-64 md:h-80 object-cover" />
                        )}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                {article.categorie && (
                                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{article.categorie}</span>
                                )}
                                {article.date_publication && (
                                    <span className="text-slate-400 text-sm">
                                        {new Date(article.date_publication).toLocaleDateString('fr-FR', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </span>
                                )}
                                <span className="text-slate-300">·</span>
                                <span className="text-slate-400 text-sm">{article.vues} lecture(s)</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">{article.titre}</h1>

                            {article.extrait && (
                                <p className="text-lg text-slate-500 border-l-4 border-blue-500 pl-4 mb-8 italic">{article.extrait}</p>
                            )}

                            {/* Contenu HTML sécurisé */}
                            <div
                                className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-blue-500 prose-strong:text-slate-800"
                                dangerouslySetInnerHTML={{ __html: article.contenu }}
                            />

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
                                    {article.tags.map((tag, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="mt-8 bg-gradient-to-r from-blue-600 to-slate-800 rounded-2xl p-8 text-center text-white">
                        <h3 className="text-xl font-black mb-2">Besoin de nos services ?</h3>
                        <p className="text-blue-200 text-sm mb-4">Contactez-nous ou passez directement votre commande.</p>
                        <div className="flex justify-center gap-3">
                            <Link to="/commander" className="bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm">
                                Commander
                            </Link>
                            <Link to="/contact" className="bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/30 hover:bg-white/20 transition-all text-sm">
                                Nous contacter
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link to="/blog" className="text-slate-500 hover:text-blue-500 font-semibold text-sm transition-colors">
                            ← Retour au blog
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
