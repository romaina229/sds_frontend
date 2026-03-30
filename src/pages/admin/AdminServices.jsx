import React, { useState, useEffect } from 'react';
import api, { formatPriceFcfa } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
    { value: 'web', label: '🌐 Sites Web' },
    { value: 'excel', label: '📊 Gestion & Données' },
    { value: 'survey', label: '📋 Collecte de Données' },
    { value: 'formation', label: '🎓 Formations & Certifications' },
    { value: 'materiel',  label: '🖥️ Matériels & Maintenance' },
];

const ICONES = [
    'fas fa-laptop', 'fas fa-globe', 'fas fa-shopping-cart', 'fas fa-cogs',
    'fas fa-chart-bar', 'fas fa-database', 'fas fa-clipboard-list', 'fas fa-tasks',
    'fas fa-chalkboard-teacher', 'fas fa-mobile-alt', 'fas fa-code', 'fas fa-server',
    'fas fa-certificate', 'fas fa-qrcode', 'fas fa-paper-plane', 'fas fa-paint-brush',
    'fas fa-desktop', 'fas fa-tools', 'fas fa-plug', 'fas fa-compact-disc',
];

const emptyForm = {
    nom: '', description: '', icone: 'fas fa-code',
    prix_fcfa: '', prix_euro: '', duree: '',
    categorie: 'web', popular: false, actif: true,
    features: '',
};

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/services');
            setServices(res.data.data);
        } catch { toast.error('Erreur chargement.'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (service) => {
        setEditing(service.id);
        setForm({
            nom: service.nom,
            description: service.description,
            icone: service.icone,
            prix_fcfa: service.prix_fcfa,
            prix_euro: service.prix_euro,
            duree: service.duree || '',
            categorie: service.categorie,
            popular: service.popular,
            actif: service.actif !== false,
            features: Array.isArray(service.features) ? service.features.join('\n') : '',
        });
        setShowForm(true);
    };

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        if (!form.nom || !form.prix_fcfa || !form.categorie) {
            toast.error('Remplissez les champs obligatoires (nom, prix, catégorie).');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                features: form.features
                    ? form.features.split('\n').map(f => f.trim()).filter(Boolean)
                    : [],
            };
            if (editing) {
                await api.put(`/admin/services/${editing}`, payload);
                toast.success('Service mis à jour.');
            } else {
                await api.post('/admin/services', payload);
                toast.success('Service créé.');
            }
            setShowForm(false);
            loadServices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, nom) => {
        if (!confirm(`Supprimer le service "${nom}" ?`)) return;
        try {
            await api.delete(`/admin/services/${id}`);
            toast.success('Service supprimé.');
            loadServices();
        } catch { toast.error('Erreur suppression.'); }
    };

    const toggleActif = async (service) => {
        try {
            await api.put(`/admin/services/${service.id}`, { ...service, actif: !service.actif });
            toast.success(service.actif ? 'Service désactivé.' : 'Service activé.');
            loadServices();
        } catch { toast.error('Erreur.'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-slate-800">Services</h1>
                <button onClick={openCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    + Nouveau service
                </button>
            </div>

            {/* Grille services */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-40 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map(service => (
                        <div key={service.id}
                            className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${service.actif ? 'border-slate-100' : 'border-slate-200 opacity-60'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <i className={`${service.icone} text-blue-500 text-sm`} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{service.nom}</div>
                                        <div className="text-xs text-slate-400">{service.categorie}</div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {service.popular && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-1.5 py-0.5 rounded">⭐</span>}
                                    {!service.actif && <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">OFF</span>}
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs mb-3 line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-black text-blue-600 text-sm">{formatPriceFcfa(service.ttc_fcfa)}</div>
                                    {service.duree && <div className="text-slate-400 text-xs">⏱ {service.duree}</div>}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => toggleActif(service)}
                                        className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${service.actif ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        {service.actif ? 'ON' : 'OFF'}
                                    </button>
                                    <button onClick={() => openEdit(service)}
                                        className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold transition-all">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(service.id, service.nom)}
                                        className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition-all">
                                        🗑
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal formulaire */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-800">
                                {editing ? 'Modifier le service' : 'Nouveau service'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom *</label>
                                <input name="nom" value={form.nom} onChange={handleInput}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                                <textarea name="description" value={form.description} onChange={handleInput} rows={2}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Prix HT (FCFA) *</label>
                                <input type="number" name="prix_fcfa" value={form.prix_fcfa} onChange={handleInput}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Prix HT (Euro)</label>
                                <input type="number" name="prix_euro" value={form.prix_euro} onChange={handleInput} step="0.01"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Catégorie *</label>
                                <select name="categorie" value={form.categorie} onChange={handleInput}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white">
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Durée estimée</label>
                                <input name="duree" value={form.duree} onChange={handleInput} placeholder="ex: 7-10 jours"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Icône Font Awesome</label>
                                <select name="icone" value={form.icone} onChange={handleInput}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white">
                                    {ICONES.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="popular" checked={form.popular} onChange={handleInput} className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm font-semibold text-slate-700">Populaire ⭐</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="actif" checked={form.actif} onChange={handleInput} className="w-4 h-4 rounded accent-green-500" />
                                    <span className="text-sm font-semibold text-slate-700">Actif</span>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Fonctionnalités <span className="text-slate-400 font-normal">(une par ligne)</span>
                                </label>
                                <textarea name="features" value={form.features} onChange={handleInput} rows={4}
                                    placeholder="Design responsive&#10;5 pages&#10;Formulaire contact"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm">
                                Annuler
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2">
                                {saving ? 'Sauvegarde...' : (editing ? 'Mettre à jour' : 'Créer le service')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}