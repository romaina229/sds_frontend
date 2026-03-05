import React from 'react';

/**
 * Carte statistique pour le dashboard admin.
 *
 * Props:
 *   - icon: string (emoji ou classe FA)
 *   - label: string
 *   - value: string | number
 *   - sub: string (texte secondaire optionnel)
 *   - color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal'
 *   - loading: bool
 */
const COLORS = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-500',  text: 'text-green-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-500',    text: 'text-red-600' },
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-500',   text: 'text-teal-600' },
};

export default function StatsCard({ icon, label, value, sub, color = 'blue', loading = false }) {
    const c = COLORS[color] || COLORS.blue;

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
                <div className="h-7 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0`}>
                    {icon}
                </div>
                {sub && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${c.bg} ${c.text}`}>{sub}</span>
                )}
            </div>
            <div className="text-2xl font-black text-slate-800 mb-1">{value ?? '—'}</div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}
