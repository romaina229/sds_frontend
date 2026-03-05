import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { formatPriceFcfa, formatPriceEuro } from '../../utils/api';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
    { key: 'web',       label: 'Sites Web',           icon: 'fas fa-laptop-code',    color: 'text-blue-500' },
    { key: 'excel',     label: 'Gestion & Données',   icon: 'fas fa-table',          color: 'text-green-500' },
    { key: 'survey',    label: 'Collecte de Données', icon: 'fas fa-clipboard-list', color: 'text-orange-500' },
    { key: 'formation', label: 'Formations',           icon: 'fas fa-graduation-cap', color: 'text-purple-500' },
];

const METHODES_PAIEMENT = [
    {
        id: 'mobile_money',
        label: 'Mobile Money',
        desc: 'Orange Money · MTN Mobile Money · Moov',
        icon: '📱',
        color: 'orange',
    },
    {
        id: 'fedapay',
        label: 'FedaPay',
        desc: 'Carte bancaire · Virement sécurisé',
        icon: '💳',
        color: 'blue',
    },
    {
        id: 'virement',
        label: 'Virement Bancaire',
        desc: 'Virement direct sur notre compte',
        icon: '🏦',
        color: 'green',
    },
];

export default function CommandePage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [step, setStep] = useState(serviceId ? 2 : 1);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [filterCat, setFilterCat] = useState('web');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        client_nom: '',
        client_email: '',
        client_telephone: '',
        client_entreprise: '',
        message: '',
        methode_paiement: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        if (serviceId) {
            api.get(`/services/${serviceId}`).then(res => {
                setSelectedService(res.data.data);
                setStep(2);
            }).catch(() => toast.error('Service introuvable.'));
        }
    }, [serviceId]);

    const loadServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/services');
            setServices(res.data.data);
        } catch {
            toast.error('Impossible de charger les services.');
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(s => s.categorie === filterCat);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep2 = () => {
        const errs = {};
        if (!form.client_nom.trim()) errs.client_nom = 'Le nom est obligatoire';
        if (!form.client_email.trim()) errs.client_email = 'L\'email est obligatoire';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) errs.client_email = 'Email invalide';
        if (!form.client_telephone.trim()) errs.client_telephone = 'Le téléphone est obligatoire';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep3 = () => {
        if (!form.methode_paiement) {
            toast.error('Veuillez choisir une méthode de paiement.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateStep3()) return;

        setSubmitting(true);
        try {
            const res = await api.post('/commandes', {
                service_id: selectedService.id,
                ...form,
            });

            if (res.data.success) {
                if (res.data.redirect && res.data.payment_url) {
                    // Redirection vers la page de paiement externe (FedaPay ou CinetPay)
                    toast.info('Redirection vers la page de paiement...');
                    window.location.href = res.data.payment_url;
                } else if (res.data.methode === 'virement') {
                    // Virement bancaire - afficher les instructions
                    navigate(`/paiement/succes/${res.data.commande.numero_commande}`, {
                        state: {
                            virement: true,
                            instructions: res.data.instructions,
                            commande: res.data.commande,
                        }
                    });
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Erreur lors de la commande.';
            toast.error(msg);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const goToStep = (nextStep) => {
        if (nextStep === 2 && !selectedService) {
            toast.error('Veuillez sélectionner un service.');
            return;
        }
        if (nextStep === 3 && !validateStep2()) return;
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const STEPS = [
        { n: 1, label: 'Service' },
        { n: 2, label: 'Informations' },
        { n: 3, label: 'Paiement' },
        { n: 4, label: 'Confirmation' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-slate-800 mb-2">Commander un Service</h1>
                        <p className="text-slate-500">Tous les prix incluent une AIB de 5%</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-10">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.n}>
                                <div className={`flex flex-col items-center ${i > 0 ? 'ml-4' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                        step > s.n ? 'bg-green-500 text-white' :
                                        step === s.n ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-110' :
                                        'bg-white text-slate-400 border-2 border-slate-200'
                                    }`}>
                                        {step > s.n ? '✓' : s.n}
                                    </div>
                                    <span className={`text-xs mt-1 font-medium ${step === s.n ? 'text-blue-500' : 'text-slate-400'}`}>{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 rounded-full ${step > s.n ? 'bg-green-400' : 'bg-slate-200'}`} style={{minWidth: 40}} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

                        {/* ÉTAPE 1 - Sélection service */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Choisissez votre service</h2>

                                {/* Filtre catégorie */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {CATEGORIES.map(cat => (
                                        <button key={cat.key}
                                            onClick={() => setFilterCat(cat.key)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                filterCat === cat.key
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}>
                                           <span><i className={`${cat.icon} ${cat.color} text-xl`} /></span> {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {loading ? (
                                    <div className="grid gap-4">
                                        {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredServices.map(service => (
                                            <button key={service.id}
                                                onClick={() => setSelectedService(service)}
                                                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                                                    selectedService?.id === service.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <i className={`${service.icone} text-blue-500`} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-800">{service.nom}</span>
                                                                {service.popular && <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">Populaire</span>}
                                                            </div>
                                                            <p className="text-slate-500 text-sm mt-1">{service.description}</p>
                                                            {service.duree && <p className="text-slate-400 text-xs mt-1">⏱ {service.duree}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="text-lg font-black text-blue-600">{formatPriceFcfa(service.ttc_fcfa)}</div>
                                                        <div className="text-slate-400 text-xs">{formatPriceEuro(service.ttc_euro)} TTC</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end mt-8">
                                    <button onClick={() => goToStep(2)}
                                        disabled={!selectedService}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-8 py-3 rounded-xl transition-all">
                                        Continuer →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ÉTAPE 2 - Informations */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Vos informations</h2>

                                {/* Récap service */}
                                {selectedService && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-blue-800">{selectedService.nom}</span>
                                            {selectedService.duree && <span className="text-blue-600 text-sm ml-2">· {selectedService.duree}</span>}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-blue-700">{formatPriceFcfa(selectedService.ttc_fcfa)}</div>
                                            <button onClick={() => setStep(1)} className="text-blue-500 text-xs hover:underline">Changer</button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField label="Nom complet *" error={errors.client_nom}>
                                        <input name="client_nom" value={form.client_nom} onChange={handleInput}
                                            placeholder="Votre nom complet"
                                            className={inputClass(errors.client_nom)} />
                                    </FormField>
                                    <FormField label="Entreprise / Organisation" error={errors.client_entreprise}>
                                        <input name="client_entreprise" value={form.client_entreprise} onChange={handleInput}
                                            placeholder="Nom de votre organisation (optionnel)"
                                            className={inputClass()} />
                                    </FormField>
                                    <FormField label="Email *" error={errors.client_email}>
                                        <input type="email" name="client_email" value={form.client_email} onChange={handleInput}
                                            placeholder="votre@email.com"
                                            className={inputClass(errors.client_email)} />
                                    </FormField>
                                    <FormField label="Téléphone *" error={errors.client_telephone}>
                                        <input type="tel" name="client_telephone" value={form.client_telephone} onChange={handleInput}
                                            placeholder="+229 00 00 00 00"
                                            className={inputClass(errors.client_telephone)} />
                                    </FormField>
                                </div>
                                <FormField label="Description de votre projet">
                                    <textarea name="message" value={form.message} onChange={handleInput}
                                        rows={4} placeholder="Décrivez brièvement votre projet, vos attentes et besoins spécifiques..."
                                        className={inputClass() + ' resize-none'} />
                                </FormField>

                                <div className="flex justify-between mt-8">
                                    {!serviceId && (
                                        <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                                            ← Retour
                                        </button>
                                    )}
                                    <button onClick={() => goToStep(3)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all ml-auto">
                                        Continuer →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ÉTAPE 3 - Paiement */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Paiement</h2>

                                {/* Récapitulatif commande */}
                                <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-4">Récapitulatif</h3>
                                    <div className="space-y-2 text-sm">
                                        <SummaryRow label="Service" value={selectedService?.nom} />
                                        <SummaryRow label="Client" value={form.client_nom} />
                                        <SummaryRow label="Email" value={form.client_email} />
                                        <SummaryRow label="Durée estimée" value={selectedService?.duree} />
                                        <div className="border-t pt-2 mt-2">
                                            <SummaryRow label="Montant HT" value={formatPriceFcfa(selectedService?.prix_fcfa)} />
                                            <SummaryRow label={`AIB (5%)`} value={formatPriceFcfa(selectedService?.aib_fcfa)} />
                                            <div className="flex justify-between font-black text-base text-blue-700 mt-1 pt-2 border-t">
                                                <span>Total TTC</span>
                                                <span>{formatPriceFcfa(selectedService?.ttc_fcfa)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Méthodes de paiement */}
                                <h3 className="font-bold text-slate-800 mb-4">Choisissez votre méthode de paiement</h3>
                                <div className="grid gap-3 mb-8">
                                    {METHODES_PAIEMENT.map(m => (
                                        <button key={m.id}
                                            onClick={() => setForm(prev => ({ ...prev, methode_paiement: m.id }))}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                                form.methode_paiement === m.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{m.icon}</span>
                                                <div>
                                                    <div className="font-bold text-slate-800">{m.label}</div>
                                                    <div className="text-slate-500 text-sm">{m.desc}</div>
                                                </div>
                                                {form.methode_paiement === m.id && (
                                                    <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Note sécurité */}
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <span className="text-green-500 text-xl">🔒</span>
                                    <div className="text-sm text-green-700">
                                        <strong>Paiement 100% sécurisé</strong> — Vos données sont chiffrées.
                                        FedaPay et CinetPay sont des passerelles de paiement certifiées opérant en Afrique de l'Ouest.
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 transition-all">
                                        ← Retour
                                    </button>
                                    <button onClick={handleSubmit}
                                        disabled={submitting || !form.methode_paiement}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2">
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                                Traitement...
                                            </>
                                        ) : 'Confirmer & Payer →'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

// Composants helpers
function FormField({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-500">{label} :</span>
            <span className="font-medium text-slate-700">{value || '-'}</span>
        </div>
    );
}

const inputClass = (error = null) =>
    `w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
        error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white focus:border-blue-500'
    }`;
