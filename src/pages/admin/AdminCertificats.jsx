import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCertificats() {
    const [batches, setBatches]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showForm, setShowForm]       = useState(false);
    const [importing, setImporting]     = useState(false);
    const [progress, setProgress]       = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [form, setForm]               = useState({ nom_batch: '', organisation: 'Shalom Digital Solutions' });
    const fileRef                        = useRef();
    const toast                          = useToast();

    useEffect(() => { loadBatches(); }, []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/certificats');
            setBatches(res.data.data || []);
        } catch { toast.error('Erreur chargement.'); }
        finally { setLoading(false); }
    };

    const handleImport = async () => {
        const file = fileRef.current?.files[0];
        if (!file) { toast.error('Sélectionnez un fichier Excel.'); return; }
        if (!form.nom_batch) { toast.error('Nommez la formation.'); return; }

        setImporting(true);
        setProgress(null);

        const formData = new FormData();
        formData.append('fichier', file);
        formData.append('nom_batch', form.nom_batch);
        formData.append('organisation', form.organisation);

        try {
            const res = await api.post('/admin/certificats/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProgress(res.data);
            toast.success(res.data.message);
            setShowForm(false);
            loadBatches();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur import.');
        } finally {
            setImporting(false);
        }
    };

    const loadBatchDetail = async (id) => {
        try {
            const res = await api.get(`/admin/certificats/batch/${id}`);
            setSelectedBatch(res.data);
        } catch { toast.error('Erreur chargement détail.'); }
    };

    const statutColor = (s) => ({
        envoye:  'bg-green-100 text-green-700',
        genere:  'bg-blue-100 text-blue-700',
        erreur:  'bg-red-100 text-red-600',
    }[s] || 'bg-slate-100 text-slate-500');

    const statutLabel = (s) => ({
        envoye: 'Envoyé',
        genere: 'Généré',
        erreur: 'Erreur',
    }[s] || s);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Attestations & Certificats</h1>
                    <p className="text-slate-500 text-sm mt-1">Importez un fichier Excel pour générer et envoyer les certificats automatiquement</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    <i className="fas fa-file-excel" /> Importer Excel
                </button>
            </div>

            {/* Résultat dernier import */}
            {progress && (
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <i className="fas fa-check-circle text-green-500" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">Import terminé</div>
                            <div className="text-slate-500 text-sm">{progress.message}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center bg-slate-50 rounded-xl p-3">
                            <div className="text-2xl font-black text-slate-800">{progress.total}</div>
                            <div className="text-slate-500 text-xs">Total</div>
                        </div>
                        <div className="text-center bg-green-50 rounded-xl p-3">
                            <div className="text-2xl font-black text-green-600">{progress.envoyes}</div>
                            <div className="text-green-600 text-xs">Envoyés</div>
                        </div>
                        <div className="text-center bg-red-50 rounded-xl p-3">
                            <div className="text-2xl font-black text-red-500">{progress.erreurs}</div>
                            <div className="text-red-500 text-xs">Erreurs</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des batches */}
            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
                </div>
            ) : batches.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <i className="fas fa-certificate text-5xl mb-4 block opacity-20" />
                    <div className="font-semibold">Aucun import encore</div>
                    <div className="text-sm mt-1">Importez votre premier fichier Excel</div>
                </div>
            ) : (
                <div className="space-y-3">
                    {batches.map(batch => (
                        <div key={batch.id}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            onClick={() => loadBatchDetail(batch.id)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
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
            )}

            {/* Modal détail batch */}
            {selectedBatch && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">{selectedBatch.batch.nom}</h2>
                                <p className="text-slate-500 text-sm">{selectedBatch.certificats.length} certificats</p>
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
                                    {selectedBatch.certificats.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="py-3 font-semibold text-slate-800">{c.nom_complet}</td>
                                            <td className="py-3 text-slate-500">{c.email || '—'}</td>
                                            <td className="py-3 text-slate-500">{c.mention || '—'}</td>
                                            <td className="py-3 font-mono text-xs text-slate-400">{c.code_verification}</td>
                                            <td className="py-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statutColor(c.statut)}`}>
                                                    {statutLabel(c.statut)}
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

            {/* Modal formulaire import */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-800">Importer un fichier Excel</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        {/* Guide colonnes */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm">
                            <div className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <i className="fas fa-info-circle" /> Format attendu du fichier Excel
                            </div>
                            <div className="text-blue-600 font-mono text-xs leading-relaxed">
                                A: Nom complet &nbsp;|&nbsp; B: Formation &nbsp;|&nbsp; C: Date<br/>
                                D: Durée &nbsp;|&nbsp; E: Mention &nbsp;|&nbsp; F: Organisation &nbsp;|&nbsp; G: Email
                            </div>
                            <div className="text-blue-400 text-xs mt-2">La première ligne est l'en-tête (ignorée automatiquement)</div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la formation *</label>
                                <input value={form.nom_batch}
                                    onChange={e => setForm(p => ({ ...p, nom_batch: e.target.value }))}
                                    placeholder="ex: Formation KoboToolbox Mars 2026"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Organisation</label>
                                <input value={form.organisation}
                                    onChange={e => setForm(p => ({ ...p, organisation: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Fichier Excel *</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                                    onClick={() => fileRef.current.click()}>
                                    <i className="fas fa-file-excel text-green-500 text-3xl mb-2 block" />
                                    <div className="text-slate-600 font-semibold text-sm">Cliquez pour sélectionner</div>
                                    <div className="text-slate-400 text-xs mt-1">.xlsx, .xls, .csv acceptés</div>
                                    <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                                        onChange={e => e.target.files[0] && toast.success(e.target.files[0].name + ' sélectionné')} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 text-sm">
                                Annuler
                            </button>
                            <button onClick={handleImport} disabled={importing}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all">
                                {importing
                                    ? <><i className="fas fa-spinner fa-spin" /> Génération en cours...</>
                                    : <><i className="fas fa-paper-plane" /> Générer &amp; Envoyer</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
