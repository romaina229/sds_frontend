import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
    titre: '', extrait: '', contenu: '',
    image: '', categorie: '', tags: '',
    statut: 'brouillon',
};

export default function AdminBlog() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    useEffect(() => { loadArticles(); }, []);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/blog');
            setArticles(res.data.data || []);
        } catch { toast.error('Erreur chargement.'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (article) => {
        setEditing(article.id);
        setForm({
            titre: article.titre,
            extrait: article.extrait || '',
            contenu: article.contenu,
            image: article.image || '',
            categorie: article.categorie || '',
            tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
            statut: article.statut,
        });
        setShowForm(true);
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.titre || !form.contenu) {
            toast.error('Titre et contenu obligatoires.');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            };
            if (editing) {
                await api.put(`/admin/blog/${editing}`, payload);
                toast.success('Article mis à jour.');
            } else {
                await api.post('/admin/blog', payload);
                toast.success('Article créé.');
            }
            setShowForm(false);
            loadArticles();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, titre) => {
        if (!confirm(`Supprimer l'article "${titre}" ?`)) return;
        try {
            await api.delete(`/admin/blog/${id}`);
            toast.success('Article supprimé.');
            loadArticles();
        } catch { toast.error('Erreur suppression.'); }
    };

    const togglePublie = async (article) => {
        const newStatut = article.statut === 'publie' ? 'brouillon' : 'publie';
        try {
            await api.put(`/admin/blog/${article.id}`, { ...article, statut: newStatut });
            toast.success(newStatut === 'publie' ? 'Article publié.' : 'Article mis en brouillon.');
            loadArticles();
        } catch { toast.error('Erreur.'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-slate-800">Blog</h1>
                <button onClick={openCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    + Nouvel article
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
                </div>
            ) : articles.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
                    <div className="text-5xl mb-4">📝</div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Aucun article</h2>
                    <p className="text-slate-400 mb-6">Créez votre premier article de blog.</p>
                    <button onClick={openCreate} className="bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all">
                        Créer un article
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-5 py-3">Titre</th>
                                <th className="text-left px-5 py-3">Catégorie</th>
                                <th className="text-left px-5 py-3">Statut</th>
                                <th className="text-left px-5 py-3">Vues</th>
                                <th className="text-left px-5 py-3">Date</th>
                                <th className="text-left px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="font-semibold text-slate-800 text-sm">{article.titre}</div>
                                        {article.extrait && <div className="text-slate-400 text-xs line-clamp-1 mt-0.5">{article.extrait}</div>}
                                    </td>
                                    <td className="px-5 py-3">
                                        {article.categorie && (
                                            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-lg">{article.categorie}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${article.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {article.statut === 'publie' ? '✓ Publié' : '● Brouillon'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500 text-sm">{article.vues || 0}</td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">
                                        {article.date_publication
                                            ? new Date(article.date_publication).toLocaleDateString('fr-FR')
                                            : new Date(article.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-1">
                                            <button onClick={() => togglePublie(article)}
                                                className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${article.statut === 'publie' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                                {article.statut === 'publie' ? 'Dépublier' : 'Publier'}
                                            </button>
                                            <button onClick={() => openEdit(article)}
                                                className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold transition-all">✏️</button>
                                            <button onClick={() => handleDelete(article.id, article.titre)}
                                                className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition-all">🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal formulaire article */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-6 my-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-800">
                                {editing ? 'Modifier l\'article' : 'Nouvel article'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Titre *</label>
                                <input name="titre" value={form.titre} onChange={handleInput}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Catégorie</label>
                                    <input name="categorie" value={form.categorie} onChange={handleInput} placeholder="ex: Tutoriel, Actualité..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Statut</label>
                                    <select name="statut" value={form.statut} onChange={handleInput}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white">
                                        <option value="brouillon">Brouillon</option>
                                        <option value="publie">Publié</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Image (URL)</label>
                                <input name="image" value={form.image} onChange={handleInput} placeholder="https://..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Extrait</label>
                                <textarea name="extrait" value={form.extrait} onChange={handleInput} rows={2}
                                    placeholder="Résumé de l'article affiché dans la liste..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Contenu * <span className="text-slate-400 font-normal">(HTML accepté)</span></label>
                                <textarea name="contenu" value={form.contenu} onChange={handleInput} rows={10}
                                    placeholder="<p>Contenu de votre article...</p>"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-mono resize-y" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Tags <span className="text-slate-400 font-normal">(séparés par des virgules)</span></label>
                                <input name="tags" value={form.tags} onChange={handleInput} placeholder="web, développement, bénin"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm">
                                Annuler
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                                {saving ? 'Sauvegarde...' : (editing ? 'Mettre à jour' : 'Créer l\'article')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
