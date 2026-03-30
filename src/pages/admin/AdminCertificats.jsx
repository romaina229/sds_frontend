import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const TABS = [
    { key: 'liste',  label: 'Historique',      icon: 'fas fa-list' },
    { key: 'manuel', label: 'Saisie manuelle', icon: 'fas fa-user-plus' },
    { key: 'import', label: 'Import Excel',    icon: 'fas fa-file-excel' },
];

const emptyForm = {
    nom_complet:    '',
    formation:      '',
    organisation:   'Shalom Digital Solutions',
    date_formation: new Date().toISOString().split('T')[0],
    duree:          '',
    mention:        '',
    email:          '',
};

export default function AdminCertificats() {
    const [tab, setTab]                     = useState('liste');
    const [batches, setBatches]             = useState([]);
    const [loading, setLoading]             = useState(true);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [form, setForm]                   = useState(emptyForm);
    const [saving, setSaving]               = useState(false);
    const [generated, setGenerated]         = useState(null);
    const [importForm, setImportForm]       = useState({ nom_batch: '', organisation: 'Shalom Digital Solutions' });
    const [importing, setImporting]         = useState(false);
    const [importResult, setImportResult]   = useState(null);
    const fileRef                           = useRef();
    const toast                             = useToast();

    useEffect(() => { loadBatches(); }, []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/certificats');
            setBatches(res.data.data || []);
        } catch { toast.error('Erreur chargement.'); }
        finally { setLoading(false); }
    };

    const handleManual = async (action) => {
        if (!form.nom_complet || !form.formation || !form.date_formation) {
            toast.error('Remplissez au minimum : nom, formation et date.');
            return;
        }
        setSaving(true);
        setGenerated(null);
        try {
            const res = await api.post('/admin/certificats/manuel', { ...form, action });
            setGenerated({ ...res.data, action });
            toast.success(action === 'email' ? 'Certificat envoyé par email !' : 'Certificat généré !');
            if ((action === 'download' || action === 'both') && res.data.pdf_url) {
                window.open(res.data.pdf_url, '_blank');
            }
            loadBatches();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur génération.');
        } finally { setSaving(false); }
    };

    const handleImport = async () => {
        const file = fileRef.current?.files[0];
        if (!file)                 { toast.error('Sélectionnez un fichier Excel.'); return; }
        if (!importForm.nom_batch) { toast.error('Nommez la formation.'); return; }
        setImporting(true);
        setImportResult(null);
        const formData = new FormData();
        formData.append('fichier',      file);
        formData.append('nom_batch',    importForm.nom_batch);
        formData.append('organisation', importForm.organisation);
        try {
            const res = await api.post('/admin/certificats/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImportResult(res.data);
            toast.success(res.data.message);
            loadBatches();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur import.');
        } finally { setImporting(false); }
    };

    const loadBatchDetail = async (id) => {
        try {
            const res = await api.get(`/admin/certificats/batch/${id}`);
            setSelectedBatch(res.data);
        } catch { toast.error('Erreur chargement détail.'); }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-800">Attestations & Certificats</h1>
                <p className="text-slate-500 text-sm mt-1">Génération automatique de certificats PDF professionnels</p>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            tab === t.key
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}>
                        <i className={t.icon} /> {t.label}
                    </button>
                ))}
            </div>

            {/* ── HISTORIQUE ── */}
            {tab === 'liste' && (
                loading ? (
                    <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}</div>
                ) : batches.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                        <i className="fas fa-certificate text-5xl text-slate-200 mb-4 block" />
                        <div className="font-semibold text-slate-400">Aucun certificat encore généré</div>
                        <p className="text-slate-400 text-sm mt-1">Utilisez la saisie manuelle ou l'import Excel</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {batches.map(batch => (
                            <div key={batch.id} onClick={() => loadBatchDetail(batch.id)}
                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                            <i className="fas fa-certificate text-purple-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{batch.nom}</div>
                                            <div className="text-slate-400 text-xs">
                                                {new Date(batch.created_at).toLocaleDateString('fr-FR')} · {batch.total} participant(s)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-green-600">{batch.envoyes} envoyés</div>
                                            {batch.erreurs > 0 && <div className="text-xs text-red-500">{batch.erreurs} erreurs</div>}
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${batch.statut === 'termine' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {batch.statut === 'termine' ? 'Terminé' : 'En cours'}
                                        </span>
                                        <i className="fas fa-chevron-right text-slate-300 text-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* ── SAISIE MANUELLE ── */}
            {tab === 'manuel' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Formulaire */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                            <i className="fas fa-user-plus text-purple-500" /> Informations du participant
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Nom complet *',     name: 'nom_complet',    type: 'text',  placeholder: 'Jean-Marie AGOSSOU' },
                                { label: 'Formation *',       name: 'formation',      type: 'text',  placeholder: 'Formation KoboToolbox Avancé' },
                                { label: 'Organisation',      name: 'organisation',   type: 'text',  placeholder: 'Shalom Digital Solutions' },
                                { label: 'Date *',            name: 'date_formation', type: 'date',  placeholder: '' },
                                { label: 'Durée',             name: 'duree',          type: 'text',  placeholder: '3 jours · 18h' },
                                { label: 'Email (optionnel)', name: 'email',          type: 'email', placeholder: 'participant@email.com' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                                    <input type={f.type} value={form[f.name]} placeholder={f.placeholder}
                                        onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm transition-colors" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Mention</label>
                                <select value={form.mention} onChange={e => setForm(p => ({ ...p, mention: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm bg-white">
                                    <option value="">— Sans mention —</option>
                                    <option>Excellent</option>
                                    <option>Très Bien</option>
                                    <option>Bien</option>
                                    <option>Passable</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleManual('download')} disabled={saving}
                                className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                                {saving ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-download" />} Télécharger PDF
                            </button>
                            <button onClick={() => handleManual('email')} disabled={saving || !form.email}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                                {saving ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-paper-plane" />} Envoyer email
                            </button>
                        </div>
                        <button onClick={() => handleManual('both')} disabled={saving || !form.email}
                            className="w-full mt-2 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 disabled:border-slate-200 disabled:text-slate-400 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                            <i className="fas fa-certificate" /> Télécharger ET envoyer par email
                        </button>
                    </div>

                    {/* Aperçu dynamique */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                            <i className="fas fa-eye text-purple-500" /> Aperçu du certificat
                        </h2>
                        {!generated ? (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                                <div className="text-center mb-5">
                                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-600/30">
                                        <i className="fas fa-certificate text-white text-2xl" />
                                    </div>
                                    <div className="font-black text-slate-800 text-lg">{form.nom_complet || 'Nom du participant'}</div>
                                    <div className="text-slate-500 text-sm italic mt-1">{form.formation || 'Nom de la formation'}</div>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { icon: 'fas fa-building', label: 'Organisation', val: form.organisation },
                                        { icon: 'fas fa-calendar', label: 'Date', val: form.date_formation ? new Date(form.date_formation + 'T00:00:00').toLocaleDateString('fr-FR') : '—' },
                                        { icon: 'fas fa-clock',    label: 'Durée',  val: form.duree || '—' },
                                        { icon: 'fas fa-star',     label: 'Mention', val: form.mention || '—' },
                                        { icon: 'fas fa-envelope', label: 'Email',  val: form.email || '—' },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2">
                                            <i className={`${row.icon} text-purple-400 w-4 text-center text-xs`} />
                                            <span className="text-slate-400 text-xs w-20 flex-shrink-0">{row.label}</span>
                                            <span className="font-semibold text-slate-700 text-xs truncate">{row.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                                    <i className="fas fa-qrcode" /> QR code de vérification généré automatiquement
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-check-circle text-green-500 text-3xl" />
                                </div>
                                <div className="font-black text-slate-800 text-lg mb-1">Certificat généré !</div>
                                <div className="text-slate-500 text-sm mb-4">{generated.message}</div>
                                {generated.code && (
                                    <div className="bg-slate-50 rounded-xl p-3 mb-4 inline-block">
                                        <div className="text-xs text-slate-400 mb-1">Code de vérification</div>
                                        <div className="font-mono font-bold text-slate-800 tracking-widest">{generated.code}</div>
                                    </div>
                                )}
                                <div className="flex gap-2 justify-center">
                                    {generated.pdf_url && (
                                        <a href={generated.pdf_url} target="_blank" rel="noreferrer"
                                            className="bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-900 transition-all">
                                            <i className="fas fa-download" /> Télécharger
                                        </a>
                                    )}
                                    <button onClick={() => { setForm(emptyForm); setGenerated(null); }}
                                        className="border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-all">
                                        Nouveau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── IMPORT EXCEL ── */}
            {tab === 'import' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                            <i className="fas fa-file-excel text-green-500" /> Import en masse
                        </h2>
                        <p className="text-slate-500 text-sm mb-5">Générez et envoyez des certificats à tous vos participants en une seule opération.</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                            <div className="font-bold text-blue-700 text-sm mb-3 flex items-center gap-2">
                                <i className="fas fa-table" /> Format du fichier Excel (ligne 1 = en-tête)
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[['A','Nom complet *'],['B','Formation'],['C','Date'],['D','Durée'],['E','Mention'],['F','Organisation'],['G','Email']].map(([col, label]) => (
                                    <div key={col} className="flex items-center gap-2 text-xs">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded font-bold flex items-center justify-center flex-shrink-0">{col}</span>
                                        <span className="text-blue-700">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la formation *</label>
                                <input value={importForm.nom_batch} onChange={e => setImportForm(p => ({ ...p, nom_batch: e.target.value }))}
                                    placeholder="ex: Formation KoboToolbox Mars 2026"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Organisation par défaut</label>
                                <input value={importForm.organisation} onChange={e => setImportForm(p => ({ ...p, organisation: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Fichier Excel *</label>
                                <div onClick={() => fileRef.current.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                                    <i className="fas fa-cloud-upload-alt text-slate-300 text-4xl mb-2 block" />
                                    <div className="text-slate-600 font-semibold text-sm">Cliquez pour sélectionner</div>
                                    <div className="text-slate-400 text-xs mt-1">.xlsx, .xls, .csv acceptés</div>
                                    <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                                </div>
                            </div>
                        </div>

                        <button onClick={handleImport} disabled={importing}
                            className="w-full mt-5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                            {importing ? <><i className="fas fa-spinner fa-spin" /> Génération en cours...</> : <><i className="fas fa-paper-plane" /> Générer &amp; Envoyer tous</>}
                        </button>
                    </div>

                    {/* Résultat */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                            <i className="fas fa-chart-bar text-purple-500" /> Résultats
                        </h2>
                        {!importResult ? (
                            <div className="text-center py-12 text-slate-300">
                                <i className="fas fa-inbox text-5xl mb-3 block" />
                                <div className="text-sm">Les résultats apparaîtront ici après l'import</div>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className="text-center bg-slate-50 rounded-xl p-3">
                                        <div className="text-2xl font-black text-slate-800">{importResult.total}</div>
                                        <div className="text-slate-500 text-xs font-semibold">Total</div>
                                    </div>
                                    <div className="text-center bg-green-50 rounded-xl p-3">
                                        <div className="text-2xl font-black text-green-600">{importResult.envoyes}</div>
                                        <div className="text-green-600 text-xs font-semibold">Envoyés</div>
                                    </div>
                                    <div className="text-center bg-red-50 rounded-xl p-3">
                                        <div className="text-2xl font-black text-red-500">{importResult.erreurs}</div>
                                        <div className="text-red-500 text-xs font-semibold">Erreurs</div>
                                    </div>
                                </div>
                                <div className="space-y-2 max-h-72 overflow-y-auto">
                                    {importResult.resultats?.map((r, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
                                            <div>
                                                <div className="font-semibold text-slate-800">{r.nom}</div>
                                                <div className="text-slate-400 text-xs">{r.email || 'Pas d\'email'}</div>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                r.statut === 'envoye' ? 'bg-green-100 text-green-700' :
                                                r.statut === 'erreur' ? 'bg-red-100 text-red-600' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {r.statut === 'envoye' ? 'Envoyé' : r.statut === 'erreur' ? 'Erreur' : 'Généré'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal détail batch */}
            {selectedBatch && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">{selectedBatch.batch?.nom}</h2>
                                <p className="text-slate-500 text-sm">{selectedBatch.certificats?.length} certificats</p>
                            </div>
                            <button onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-slate-600 text-xl">
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                                        <th className="pb-3 font-semibold">Nom</th>
                                        <th className="pb-3 font-semibold">Email</th>
                                        <th className="pb-3 font-semibold">Mention</th>
                                        <th className="pb-3 font-semibold">Code</th>
                                        <th className="pb-3 font-semibold">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {selectedBatch.certificats?.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="py-3 font-semibold text-slate-800">{c.nom_complet}</td>
                                            <td className="py-3 text-slate-500 text-xs">{c.email || '—'}</td>
                                            <td className="py-3 text-slate-500 text-xs">{c.mention || '—'}</td>
                                            <td className="py-3 font-mono text-xs text-slate-400">{c.code_verification}</td>
                                            <td className="py-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    c.statut === 'envoye' ? 'bg-green-100 text-green-700' :
                                                    c.statut === 'erreur' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {c.statut === 'envoye' ? 'Envoyé' : c.statut === 'erreur' ? 'Erreur' : 'Généré'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}