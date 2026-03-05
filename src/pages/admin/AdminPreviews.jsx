import { useState } from 'react';

const DEMO_COMMANDE = {
    numero_commande: 'SDS-2026-00123', client_nom: 'Jean DUPONT',
    montant_fcfa: 150000, tva_fcfa: 7500, total_ttc_fcfa: 157500,
    methode_paiement: 'FedaPay Mobile Money', paiement_at: '05/03/2026 à 14:32',
    service: { nom: 'Site Vitrine Standard', duree: '2-3 semaines' },
};
const DEMO_CONTACT = {
    reference: 'CTX-2026-00089', nom: 'Marie JOHNSON', email: 'marie@ong-benin.org',
    telephone: '+229 97 12 34 56', entreprise: 'ONG Solidarité Bénin',
    sujet: 'Demande de devis - Système KoboToolbox', date: '05/03/2026 à 15:47',
    message: "Bonjour,\n\nNous sommes une ONG basée à Cotonou et nous cherchons à mettre en place un système de collecte de données pour notre enquête terrain 2026.\n\nNous avons environ 50 agents de collecte. Pourriez-vous nous faire une proposition ?\n\nMerci d'avance.",
};
const DEMO_FACTURE = {
    numero_facture: 'FAC-2026-00123', client_nom: 'Jean DUPONT',
    client_email: 'jean.dupont@email.com', client_telephone: '+229 97 00 11 22',
    client_entreprise: 'Solutions SARL', date: '05/03/2026', commande: 'SDS-2026-00123',
    service_nom: 'Site Vitrine Standard', duree: '2-3 semaines',
    montant_fcfa: 150000, montant_euro: 230, tva_fcfa: 7500, total_ttc_fcfa: 157500,
    methode_paiement: 'FedaPay Mobile Money', paiement_at: '05/03/2026 à 14:32',
};

function fmt(n) { return n.toLocaleString('fr-FR'); }

function buildEmailConfirmation(c) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Helvetica Neue",Arial,sans-serif;background:#f8fafc;color:#334155;line-height:1.6}.wrapper{max-width:600px;margin:0 auto;background:#fff}.header{background:linear-gradient(135deg,#1e40af,#1e293b);padding:40px 32px;text-align:center}.header h1{color:#fff;font-size:22px;font-weight:700}.header p{color:#93c5fd;font-size:14px;margin-top:6px}.badge{display:inline-block;background:#22c55e;color:#fff;font-weight:700;font-size:13px;padding:6px 16px;border-radius:20px;margin-top:16px}.body{padding:40px 32px}.greeting{font-size:18px;font-weight:600;color:#1e293b;margin-bottom:12px}.text{color:#64748b;font-size:15px;margin-bottom:24px}.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:24px 0}.card-title{font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:16px}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px}.row:last-child{border-bottom:none}.row .label{color:#94a3b8}.row .value{font-weight:600;color:#1e293b;text-align:right}.total-row{background:#eff6ff;border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:16px}.total-row .label{font-weight:700;color:#1e40af}.total-row .value{font-size:20px;font-weight:900;color:#1e40af}.steps{margin:24px 0}.step{display:flex;gap:12px;margin-bottom:16px;align-items:flex-start}.step-num{width:28px;height:28px;background:#1e40af;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}.step-text{padding-top:4px;font-size:14px;color:#475569}.btn{display:inline-block;background:#1e40af;color:#fff!important;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;margin:8px 4px}.btn-center{text-align:center;margin:24px 0}.footer{background:#1e293b;padding:24px 32px;text-align:center}.footer p{color:#64748b;font-size:12px;line-height:1.8}.footer a{color:#93c5fd;text-decoration:none}.divider{border:none;border-top:1px solid #e2e8f0;margin:24px 0}</style></head><body><div class="wrapper"><div class="header"><h1>🎉 Paiement confirmé !</h1><p>Votre commande a été reçue et enregistrée</p><div class="badge">✓ Commande ${c.numero_commande}</div></div><div class="body"><p class="greeting">Bonjour ${c.client_nom},</p><p class="text">Nous avons bien reçu votre paiement. Notre équipe va prendre en charge votre projet dans les meilleurs délais.</p><div class="card"><div class="card-title">Récapitulatif de commande</div><div class="row"><span class="label">Numéro</span><span class="value">${c.numero_commande}</span></div><div class="row"><span class="label">Service</span><span class="value">${c.service.nom}</span></div><div class="row"><span class="label">Durée estimée</span><span class="value">${c.service.duree}</span></div><div class="row"><span class="label">Date de paiement</span><span class="value">${c.paiement_at}</span></div><div class="row"><span class="label">Méthode</span><span class="value">${c.methode_paiement}</span></div><hr class="divider"><div class="row"><span class="label">Montant HT</span><span class="value">${fmt(c.montant_fcfa)} FCFA</span></div><div class="row"><span class="label">AIB (5%)</span><span class="value">${fmt(c.tva_fcfa)} FCFA</span></div><div class="total-row"><span class="label">Total payé</span><span class="value">${fmt(c.total_ttc_fcfa)} FCFA</span></div></div><div class="steps"><div class="step"><div class="step-num">1</div><div class="step-text"><strong>Analyse</strong> – Nous étudions votre demande (sous 24h ouvrées)</div></div><div class="step"><div class="step-num">2</div><div class="step-text"><strong>Démarrage</strong> – Vous recevez un email de confirmation avec le planning</div></div><div class="step"><div class="step-num">3</div><div class="step-text"><strong>Livraison</strong> – Votre projet vous est livré dans les délais convenus</div></div></div><div class="btn-center"><a href="#" class="btn">📄 Télécharger ma facture</a></div><hr class="divider"><p class="text" style="font-size:13px">📧 <a href="mailto:liferopro@gmail.com" style="color:#1e40af">liferopro@gmail.com</a> &nbsp;·&nbsp; 💬 <a href="https://wa.me/22994592567" style="color:#1e40af">WhatsApp +229 01 94 59 25 67</a></p></div><div class="footer"><p><strong style="color:#94a3b8">Shalom Digital Solutions</strong><br>Abomey-Calavi, Bénin</p></div></div></body></html>`;
}

function buildEmailContact(ct) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;background:#f8fafc;color:#334155;margin:0}.wrapper{max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}.header{background:#1e293b;padding:24px 32px}.header h1{color:#fff;font-size:18px;margin:0}.header p{color:#94a3b8;font-size:13px;margin:4px 0 0}.badge{display:inline-block;background:#3b82f6;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;margin-top:10px}.body{padding:32px}.field{margin-bottom:16px}.field-label{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}.field-value{font-size:15px;color:#1e293b;font-weight:500}.message-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;color:#475569;white-space:pre-wrap}.actions{margin-top:24px;text-align:center}.btn{display:inline-block;background:#1e40af;color:#fff!important;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin:4px}.footer{background:#f8fafc;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0}</style></head><body><div class="wrapper"><div class="header"><h1>📬 Nouveau message de contact</h1><p>Reçu le ${ct.date}</p><div class="badge">Réf. ${ct.reference}</div></div><div class="body"><div class="field"><div class="field-label">Expéditeur</div><div class="field-value">${ct.nom}</div></div><div class="field"><div class="field-label">Email</div><div class="field-value"><a href="mailto:${ct.email}" style="color:#1e40af">${ct.email}</a></div></div><div class="field"><div class="field-label">Téléphone</div><div class="field-value">${ct.telephone}</div></div><div class="field"><div class="field-label">Organisation</div><div class="field-value">${ct.entreprise}</div></div><div class="field"><div class="field-label">Sujet</div><div class="field-value">${ct.sujet}</div></div><div class="field"><div class="field-label">Message</div><div class="message-box">${ct.message}</div></div><div class="actions"><a href="mailto:${ct.email}" class="btn">✉️ Répondre</a><a href="/admin/contacts" class="btn" style="background:#475569">Voir dans l'admin</a></div></div><div class="footer">Shalom Digital Solutions · Abomey-Calavi, Bénin</div></div></body></html>`;
}

function buildFacture(f) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#333;font-size:12px;background:#fff}.container{padding:40px}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;border-bottom:3px solid #3498db;padding-bottom:20px}.logo-section h1{color:#2c3e50;font-size:22px;font-weight:900}.logo-section h1 span{color:#3498db}.logo-section p{color:#666;font-size:11px;margin-top:5px}.invoice-info{text-align:right}.invoice-info h2{color:#3498db;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:2px}.invoice-info p{color:#666;font-size:11px}.invoice-number{color:#2c3e50;font-weight:bold;font-size:14px}.parties{display:flex;justify-content:space-between;margin-bottom:30px;gap:30px}.party{flex:1}.party h3{background:#3498db;color:white;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}.party p{padding:2px 0;color:#555;line-height:1.6}.party strong{color:#2c3e50}table{width:100%;border-collapse:collapse;margin-bottom:25px}thead th{background:#2c3e50;color:white;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase}tbody td{padding:12px;border-bottom:1px solid #eee;font-size:12px}tbody tr:nth-child(even){background:#f8f9fa}tfoot td{padding:8px 12px;font-weight:bold}.total-row{background:#3498db!important}.total-row td{color:white!important;font-size:14px}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#999;font-size:10px}.status-badge{display:inline-block;background:#27ae60;color:white;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold}.aib-note{background:#fff3cd;padding:8px 12px;border-left:4px solid #f39c12;font-size:11px;color:#856404;margin-bottom:20px}</style></head><body><div class="container"><div class="header"><div class="logo-section"><h1>Shalom Digital <span>Solutions</span></h1><p>Solutions Numériques Complètes</p><p>Abomey-Calavi, Bénin</p><p>+229 01 69 35 17 66 | liferopro@gmail.com</p></div><div class="invoice-info"><h2>Facture</h2><p class="invoice-number">${f.numero_facture}</p><p>Date : ${f.date}</p><p>Commande : ${f.commande}</p><p>Statut : <span class="status-badge">PAYÉE</span></p></div></div><div class="parties"><div class="party"><h3>Émetteur</h3><p><strong>Shalom Digital Solutions</strong></p><p>Abomey-Calavi, Bénin</p><p>+229 01 69 35 17 66</p><p>liferopro@gmail.com</p></div><div class="party"><h3>Client</h3><p><strong>${f.client_nom}</strong></p><p>${f.client_entreprise}</p><p>${f.client_email}</p><p>${f.client_telephone}</p></div></div><table><thead><tr><th>Désignation</th><th>Durée</th><th style="text-align:right">Prix HT (FCFA)</th><th style="text-align:right">Prix HT (€)</th></tr></thead><tbody><tr><td><strong>${f.service_nom}</strong><br><small style="color:#666">Commande N° ${f.commande}</small></td><td>${f.duree}</td><td style="text-align:right">${fmt(f.montant_fcfa)} FCFA</td><td style="text-align:right">${f.montant_euro.toLocaleString('fr-FR',{minimumFractionDigits:2})} €</td></tr></tbody><tfoot><tr style="background:#f8f9fa"><td colspan="2" style="text-align:right">Montant HT :</td><td colspan="2" style="text-align:right">${fmt(f.montant_fcfa)} FCFA</td></tr><tr style="background:#f8f9fa"><td colspan="2" style="text-align:right">AIB (5%) :</td><td colspan="2" style="text-align:right">${fmt(f.tva_fcfa)} FCFA</td></tr><tr class="total-row"><td colspan="2" style="text-align:right;font-size:14px">TOTAL TTC :</td><td colspan="2" style="text-align:right;font-size:16px;font-weight:900">${fmt(f.total_ttc_fcfa)} FCFA</td></tr></tfoot></table><div class="aib-note"><strong>Note fiscale :</strong> AIB de 5% appliquée conformément à la législation fiscale du Bénin.</div><p style="font-size:11px;color:#555"><strong>Paiement :</strong> ${f.methode_paiement} | <strong>Date :</strong> ${f.paiement_at}</p><div class="footer"><p>Merci pour votre confiance ! | Shalom Digital Solutions - 2026</p></div></div></body></html>`;
}

const TABS = [
    { id: 'email1', icon: '📧', label: 'Email Confirmation', desc: 'Envoyé au client après paiement', barLabel: 'Email → client@example.com — Confirmation de paiement' },
    { id: 'email2', icon: '📬', label: 'Email Contact',      desc: 'Envoyé à l\'admin à chaque nouveau contact', barLabel: 'Email → admin@shalomdigitalsolutions.com — Nouveau contact' },
    { id: 'pdf',    icon: '🧾', label: 'Facture PDF',        desc: 'Générée par DomPDF au format A4', barLabel: 'Facture PDF — FAC-2026-00123.pdf' },
];

export default function AdminPreviews() {
    const [active, setActive] = useState('email1');

    const html = {
        email1: buildEmailConfirmation(DEMO_COMMANDE),
        email2: buildEmailContact(DEMO_CONTACT),
        pdf:    buildFacture(DEMO_FACTURE),
    };

    const tab = TABS.find(t => t.id === active);

    return (
        <div className="flex flex-col h-full -m-6">
            {/* Header fixe */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Prévisualisation</h1>
                        <p className="text-slate-400 text-sm">Aperçu des emails et factures PDF</p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-full">
                        Données de démonstration
                    </span>
                </div>
                {/* Onglets */}
                <div className="flex gap-2">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActive(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                active === t.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}>
                            <span>{t.icon}</span><span>{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Barre info */}
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex-shrink-0 flex items-center gap-2 text-sm">
                <span className="text-amber-500">ℹ️</span>
                <span className="text-amber-700 font-semibold">{tab.icon} {tab.label}</span>
                <span className="text-amber-600">— {tab.desc}</span>
            </div>

            {/* Zone preview - prend tout l'espace restant */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-200">
                {/* Fausse barre navigateur */}
                <div className="bg-slate-300 px-4 py-2 flex items-center gap-2 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="flex-1 mx-3 bg-white rounded px-3 py-1 text-xs text-slate-400 font-mono truncate">
                        {tab.barLabel}
                    </div>
                </div>
                {/* iframe plein écran */}
                <iframe
                    key={active}
                    srcDoc={html[active]}
                    className="flex-1 w-full border-none bg-white"
                    title={`preview-${active}`}
                />
            </div>
        </div>
    );
}