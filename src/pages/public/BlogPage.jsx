// resources/js/pages/public/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function BlogPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/blog').then(res => setArticles(res.data.data || [])).finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-black text-slate-800 mb-2 text-center">Blog</h1>
                    <p className="text-slate-500 text-center mb-12">Actualités et conseils numériques</p>

                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <div className="text-5xl mb-4">📝</div>
                            <p>Aucun article publié pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {articles.map(article => (
                                <Link key={article.id} to={`/blog/${article.slug}`}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                                    {article.image && (
                                        <img src={article.image} alt={article.titre} className="w-full h-48 object-cover" />
                                    )}
                                    <div className="p-5">
                                        {article.categorie && (
                                            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">{article.categorie}</span>
                                        )}
                                        <h2 className="font-black text-slate-800 mt-3 mb-2 text-lg leading-tight">{article.titre}</h2>
                                        <p className="text-slate-500 text-sm line-clamp-3">{article.extrait}</p>
                                        <div className="text-blue-500 font-semibold text-sm mt-3">Lire →</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
