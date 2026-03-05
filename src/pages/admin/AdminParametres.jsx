import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const SECTIONS = [
    { titre: '🏢 Informations Générales', params: [
        { cle: 'site_nom',       label: 'Nom du site',                 type: 'text' },
        { cle: 'site_email',     label: 'Email de contact',            type: 'email' },
        { cle: 'site_telephone', label: 'Téléphone principal',         type: 'text' },
        { cle: 'site_whatsapp',  label: 'WhatsApp (ex: +22994592567)', type: 'text' },
        { cle: 'site_adresse',   label: 'Adresse',                     type: 'text' },
    ]},
    { titre: '💰 Paramètres Fiscaux', params: [
        { cle: 'taux_aib', label: 'Taux AIB (ex: 0.05 = 5%)', type: 'number', step: '0.01', min: '0', max: '1' },
    ]},
    { titre: '💳 FedaPay', params: [
        { cle: 'fedapay_environment', label: 'Environnement', type: 'select', options: ['sandbox','live'] },
        { cle: 'fedapay_public_key',  label: 'Clé publique',  type: 'text',     placeholder: 'pk_sandbox_xxx' },
        { cle: 'fedapay_secret_key',  label: 'Clé secrète',   type: 'password', placeholder: 'sk_sandbox_xxx' },
    ]},
    { titre: '📱 CinetPay', params: [
        { cle: 'cinetpay_api_key', label: 'API Key', type: 'text', placeholder: 'votre_api_key' },
        { cle: 'cinetpay_site_id', label: 'Site ID', type: 'text', placeholder: 'votre_site_id' },
    ]},
    { titre: '🔧 Système', params: [
        { cle: 'maintenance_mode', label: 'Mode maintenance', type: 'select', options: ['0','1'], labels: ['Désactivé','Activé'] },
    ]},
];

function GestionAdmins({ toast }) {
    const [admins, setAdmins]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving]     = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [form, setForm]         = useState({ name:'', email:'', password:'', password_confirmation:'' });

    const load = () => {
        setLoading(true);
        api.get('/admin/admins').then(r => setAdmins(r.data.data || [])).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.name || !form.email || !form.password) return toast.error('Remplissez tous les champs.');
        if (form.password !== form.password_confirmation) return toast.error('Les mots de passe ne correspondent pas.');
        setSaving(true);
        try {
            await api.post('/admin/admins', form);
            toast.success('Administrateur ajouté.');
            setForm({ name:'', email:'', password:'', password_confirmation:'' });
            setShowForm(false);
            load();
        } catch(e) { toast.error(e.response?.data?.message || 'Erreur.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet administrateur ?')) return;
        setDeleting(id);
        try { await api.delete(`/admin/admins/${id}`); toast.success('Supprimé.'); load(); }
        catch { toast.error('Impossible de supprimer.'); }
        finally { setDeleting(null); }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">👥 Administrateurs</h2>
                <button onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                    {showForm ? '✕ Annuler' : '+ Ajouter'}
                </button>
            </div>
            {showForm && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">Nouvel administrateur</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[['name','Nom complet','text','Jean DUPONT'],['email','Email','email','jean@shalomdigital.com'],['password','Mot de passe','password','••••••••'],['password_confirmation','Confirmer','password','••••••••']].map(([k,l,t,ph]) => (
                            <div key={k}>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">{l}</label>
                                <input type={t} value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))}
                                    placeholder={ph}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAdd} disabled={saving}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all">
                        {saving ? 'Ajout...' : '✓ Créer l\'administrateur'}
                    </button>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center py-6"><div className="animate-spin w-6 h-6 rounded-full border-4 border-blue-500 border-t-transparent"/></div>
            ) : admins.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">Aucun administrateur trouvé.</p>
            ) : (
                <div className="space-y-2">
                    {admins.map(a => (
                        <div key={a.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {a.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                                    <p className="text-slate-400 text-xs">{a.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Admin</span>
                                <button onClick={() => handleDelete(a.id)} disabled={deleting===a.id}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all text-sm disabled:opacity-40">
                                    {deleting===a.id ? '...' : '🗑️'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ChangerMotDePasse({ toast }) {
    const [form, setForm]   = useState({ current_password:'', password:'', password_confirmation:'' });
    const [saving, setSaving] = useState(false);
    const [show, setShow]   = useState({ cur:false, nw:false, cf:false });

    const handleSubmit = async () => {
        if (!form.current_password || !form.password) return toast.error('Remplissez tous les champs.');
        if (form.password !== form.password_confirmation) return toast.error('Les mots de passe ne correspondent pas.');
        if (form.password.length < 8) return toast.error('Minimum 8 caractères.');
        setSaving(true);
        try {
            await api.post('/admin/auth/change-password', form);
            toast.success('Mot de passe modifié avec succès.');
            setForm({ current_password:'', password:'', password_confirmation:'' });
        } catch(e) { toast.error(e.response?.data?.message || 'Mot de passe actuel incorrect.'); }
        finally { setSaving(false); }
    };

    const fields = [
        { key:'current_password', showKey:'cur', label:'Mot de passe actuel',     ph:'••••••••' },
        { key:'password',         showKey:'nw',  label:'Nouveau mot de passe',     ph:'Minimum 8 caractères' },
        { key:'password_confirmation', showKey:'cf', label:'Confirmer le mot de passe', ph:'••••••••' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">🔑 Changer mon mot de passe</h2>
            <div className="space-y-4 max-w-md">
                {fields.map(f => (
                    <div key={f.key}>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                        <div className="relative">
                            <input type={show[f.showKey] ? 'text' : 'password'} value={form[f.key]}
                                onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                                placeholder={f.ph}
                                className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"/>
                            <button type="button" onClick={() => setShow(p=>({...p,[f.showKey]:!p[f.showKey]}))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                                {show[f.showKey] ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={handleSubmit} disabled={saving}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl transition-all">
                    {saving ? 'Modification...' : '🔑 Modifier le mot de passe'}
                </button>
            </div>
        </div>
    );
}

export default function AdminParametres() {
    const [values, setValues]       = useState({});
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const toast = useToast();

    useEffect(() => {
        api.get('/admin/parametres').then(res => setValues(res.data.data || {})).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try { await api.post('/admin/parametres', { parametres: values }); toast.success('Paramètres sauvegardés.'); }
        catch { toast.error('Erreur lors de la sauvegarde.'); }
        finally { setSaving(false); }
    };

    const TABS = [
        { id:'general',  label:'⚙️ Configuration' },
        { id:'admins',   label:'👥 Administrateurs' },
        { id:'password', label:'🔑 Mot de passe' },
    ];

    if (loading) return <div className="flex justify-center pt-20"><div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent"/></div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Paramètres</h1>
                    <p className="text-slate-500 text-sm">Configuration, administrateurs et sécurité</p>
                </div>
                {activeTab === 'general' && (
                    <button onClick={handleSave} disabled={saving}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab===t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'general' && (
                <div className="space-y-6">
                    {SECTIONS.map((section, si) => (
                        <div key={si} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">{section.titre}</h2>
                            <div className="space-y-4">
                                {section.params.map(param => (
                                    <div key={param.cle}>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{param.label}</label>
                                        {param.type === 'select' ? (
                                            <select value={values[param.cle]||''} onChange={e => setValues(p=>({...p,[param.cle]:e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white transition-all">
                                                {param.options.map((opt,oi) => <option key={opt} value={opt}>{param.labels?param.labels[oi]:opt}</option>)}
                                            </select>
                                        ) : (
                                            <input type={param.type} value={values[param.cle]||''} onChange={e => setValues(p=>({...p,[param.cle]:e.target.value}))}
                                                placeholder={param.placeholder||''} step={param.step} min={param.min} max={param.max}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"/>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                        <h3 className="font-bold text-blue-800 mb-3">📡 URLs de Webhook</h3>
                        <div className="space-y-2 text-sm font-mono">
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <span className="text-slate-500">FedaPay: </span>
                                <span className="text-blue-700">{window.location.origin}/api/paiement/callback/fedapay</span>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <span className="text-slate-500">CinetPay: </span>
                                <span className="text-blue-700">{window.location.origin}/api/paiement/callback/cinetpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'admins'   && <GestionAdmins toast={toast} />}
            {activeTab === 'password' && <ChangerMotDePasse toast={toast} />}
        </div>
    );
}