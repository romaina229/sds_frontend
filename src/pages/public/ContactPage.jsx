import React, { useState } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';

export default function ContactPage() {
    const [form, setForm] = useState({ nom: '', email: '', telephone: '', entreprise: '', sujet: '', message: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', form);
            setSuccess(true);
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    const inp = (error) => `w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-slate-800 mb-3">Contactez-nous</h1>
                        <p className="text-slate-500 max-w-xl mx-auto">Notre équipe vous répond dans les 24h ouvrables.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Infos contact */}
                        <div className="space-y-4">
                            {[
                                { icon: 'fas fa-map-marker-alt', color: 'text-red-500',    bg: 'bg-red-50',    title: 'Adresse',   info: 'Abomey-Calavi, Bénin' },
                                { icon: 'fas fa-phone',          color: 'text-blue-500',   bg: 'bg-blue-50',   title: 'Téléphone', info: '+229 01 69 35 17 66',      href: 'tel:+22901693517 66' },
                                { icon: 'fab fa-whatsapp',       color: 'text-green-500',  bg: 'bg-green-50',  title: 'WhatsApp',  info: '+229 01 94 59 25 67',      href: 'https://wa.me/22994592567' },
                                { icon: 'fas fa-envelope',       color: 'text-purple-500', bg: 'bg-purple-50', title: 'Email',     info: 'liferopro@gmail.com',      href: 'mailto:liferopro@gmail.com' },
                                { icon: 'fas fa-clock',          color: 'text-orange-500', bg: 'bg-orange-50', title: 'Horaires',  info: 'Lun-Ven: 9h-18h\nSam: 9h-13h' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
                                    <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <i className={`${item.icon} ${item.color}`} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-700 text-sm">{item.title}</div>
                                        {item.href
                                            ? <a href={item.href} className="text-blue-500 hover:underline text-sm">{item.info}</a>
                                            : <p className="text-slate-500 text-sm whitespace-pre-line">{item.info}</p>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulaire */}
                        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">Message envoyé !</h2>
                                    <p className="text-slate-500">Nous vous répondrons dans les 24h ouvrables.</p>
                                    <button onClick={() => { setSuccess(false); setForm({ nom:'',email:'',telephone:'',entreprise:'',sujet:'',message:'' }); }}
                                        className="mt-6 bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all">
                                        Nouveau message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Envoyez-nous un message</h2>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nom complet *</label>
                                            <input name="nom" value={form.nom} onChange={handleInput} required className={inp(errors.nom)} placeholder="Votre nom" />
                                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Entreprise</label>
                                            <input name="entreprise" value={form.entreprise} onChange={handleInput} className={inp()} placeholder="Votre organisation" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                                            <input type="email" name="email" value={form.email} onChange={handleInput} required className={inp(errors.email)} placeholder="votre@email.com" />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
                                            <input type="tel" name="telephone" value={form.telephone} onChange={handleInput} className={inp()} placeholder="+229 00 00 00 00" />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Sujet *</label>
                                        <input name="sujet" value={form.sujet} onChange={handleInput} required className={inp(errors.sujet)} placeholder="Objet de votre message" />
                                        {errors.sujet && <p className="text-red-500 text-xs mt-1">{errors.sujet[0]}</p>}
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
                                        <textarea name="message" value={form.message} onChange={handleInput} required rows={5} className={inp(errors.message) + ' resize-none'} placeholder="Décrivez votre besoin..." />
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message[0]}</p>}
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all">
                                        {loading ? 'Envoi en cours...' : '✉️ Envoyer le message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
