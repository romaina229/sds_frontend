import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const STATUTS = [
    { value: '', label: 'Tous' },
    { value: 'nouveau', label: 'Nouveaux', color: 'bg-blue-100 text-blue-700' },
    { value: 'lu', label: 'Lus', color: 'bg-orange-100 text-orange-700' },
    { value: 'traite', label: 'Traités', color: 'bg-green-100 text-green-700' },
    { value: 'archive', label: 'Archivés', color: 'bg-slate-100 text-slate-600' },
];

const STATUT_COLORS = {
    nouveau: 'bg-blue-100 text-blue-700',
    lu: 'bg-orange-100 text-orange-700',
    traite: 'bg-green-100 text-green-700',
    archive: 'bg-slate-100 text-slate-500',
};

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, last_page: 1 });
    const toast = useToast();

    useEffect(() => { loadContacts(); }, [filter, page]);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/contacts', { params: { statut: filter, page } });
            setContacts(res.data.data);
            setMeta(res.data.meta || { total: res.data.data?.length, last_page: 1 });
        } catch { toast.error('Erreur chargement.'); }
        finally { setLoading(false); }
    };

    const updateStatut = async (id, newStatut) => {
        try {
            await api.patch(`/admin/contacts/${id}/statut`, { statut: newStatut });
            toast.success('Statut mis à jour.');
            loadContacts();
            if (selected?.id === id) setSelected(prev => ({ ...prev, statut: newStatut }));
        } catch { toast.error('Erreur.'); }
    };

    return (
        <div className="flex gap-6 h-full">
            {/* Liste */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black text-slate-800">Contacts</h1>
                    <span className="text-slate-400 text-sm">{meta.total || 0} message(s)</span>
                </div>

                {/* Filtres */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {STATUTS.map(s => (
                        <button key={s.value} onClick={() => { setFilter(s.value); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                filter === s.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}>
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Chargement...</div>
                    ) : contacts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-slate-400">Aucun message.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {contacts.map(contact => (
                                <button key={contact.id} onClick={() => setSelected(contact)}
                                    className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${selected?.id === contact.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800 text-sm">{contact.nom}</span>
                                                {contact.statut === 'nouveau' && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <div className="text-blue-500 text-xs truncate">{contact.email}</div>
                                            <div className="text-slate-600 text-sm font-medium mt-1 truncate">{contact.sujet}</div>
                                            <div className="text-slate-400 text-xs mt-1 line-clamp-1">{contact.message}</div>
                                        </div>
                                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${STATUT_COLORS[contact.statut]}`}>
                                                {STATUTS.find(s => s.value === contact.statut)?.label || contact.statut}
                                            </span>
                                            <span className="text-slate-400 text-xs">{new Date(contact.created_at).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Détail contact */}
            {selected && (
                <div className="w-80 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800">Détail</h2>
                            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <div className="space-y-3 text-sm mb-5">
                            <InfoRow label="Nom" value={selected.nom} />
                            <InfoRow label="Email" value={<a href={`mailto:${selected.email}`} className="text-blue-500 hover:underline">{selected.email}</a>} />
                            {selected.telephone && <InfoRow label="Tél" value={<a href={`tel:${selected.telephone}`} className="text-blue-500 hover:underline">{selected.telephone}</a>} />}
                            {selected.entreprise && <InfoRow label="Entreprise" value={selected.entreprise} />}
                            <InfoRow label="Réf." value={<span className="font-mono text-xs">{selected.reference}</span>} />
                            <InfoRow label="Date" value={new Date(selected.created_at).toLocaleDateString('fr-FR')} />
                        </div>

                        <div className="mb-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Sujet</div>
                            <p className="text-slate-800 font-semibold text-sm">{selected.sujet}</p>
                        </div>
                        <div className="mb-5">
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-slate-600 text-sm leading-relaxed max-h-48 overflow-y-auto">
                                {selected.message}
                            </div>
                        </div>

                        {/* Changer statut */}
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Changer le statut</div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {STATUTS.filter(s => s.value).map(s => (
                                    <button key={s.value} onClick={() => updateStatut(selected.id, s.value)}
                                        className={`text-xs font-bold py-2 rounded-lg transition-all ${
                                            selected.statut === s.value
                                                ? s.color
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}>
                                        {selected.statut === s.value ? '✓ ' : ''}{s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Répondre */}
                        <a href={`mailto:${selected.email}?subject=Re: ${selected.sujet}&body=Bonjour ${selected.nom},%0D%0A%0D%0A`}
                            className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm w-full">
                            ✉️ Répondre par email
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-2">
            <span className="text-slate-400 text-xs flex-shrink-0">{label} :</span>
            <span className="text-slate-700 text-right">{value || '-'}</span>
        </div>
    );
}
