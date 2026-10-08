import type {
  FamilyBudgetData,
  Transaction,
  MonthStats,
  AverageStats,
  ExpenseCategory,
  IncomeCategory,
  ExtraIncomesSummary,
} from '../types';

const STORAGE_KEY = 'bilancio_famigliare_risparmio_v4';
export const DEFAULT_USER_EMAIL = 'dreiu89@gmail.com';

const INITIAL_SEED_TRANSACTIONS: Transaction[] = [
  // =====================
  // GENNAIO 2026
  // =====================
  {
    id: 'tx-202601-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-01-02',
    payer: 'Andrea',
    notes: 'Busta paga gennaio',
    createdAt: new Date('2026-01-02').getTime(),
  },
  {
    id: 'tx-202601-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-01-05',
    payer: 'Famiglia',
    notes: 'Busta paga gennaio',
    createdAt: new Date('2026-01-05').getTime(),
  },
  {
    id: 'tx-202601-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-01-18',
    payer: 'INPS',
    notes: 'Accredito mensile figli',
    createdAt: new Date('2026-01-18').getTime(),
  },
  {
    id: 'tx-202601-04',
    type: 'expense',
    amount: 570.0,
    category: 'spesa_generica',
    description: 'Supermercato e alimentari mensili',
    date: '2026-01-28',
    payer: 'Famiglia',
    createdAt: new Date('2026-01-28').getTime(),
  },
  {
    id: 'tx-202601-05',
    type: 'expense',
    amount: 245.0,
    category: 'bollette',
    description: 'Gas e riscaldamento invernale',
    date: '2026-01-15',
    payer: 'Famiglia',
    createdAt: new Date('2026-01-15').getTime(),
  },
  {
    id: 'tx-202601-06',
    type: 'expense',
    amount: 180.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi mensili pendolari',
    date: '2026-01-22',
    payer: 'Andrea',
    createdAt: new Date('2026-01-22').getTime(),
  },

  // =====================
  // FEBBRAIO 2026
  // =====================
  {
    id: 'tx-202602-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-02-02',
    payer: 'Andrea',
    createdAt: new Date('2026-02-02').getTime(),
  },
  {
    id: 'tx-202602-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-02-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-02-05').getTime(),
  },
  {
    id: 'tx-202602-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-02-18',
    payer: 'INPS',
    createdAt: new Date('2026-02-18').getTime(),
  },
  {
    id: 'tx-202602-04',
    type: 'expense',
    amount: 540.0,
    category: 'spesa_generica',
    description: 'Spesa supermercato Esselunga e Conad',
    date: '2026-02-25',
    payer: 'Famiglia',
    createdAt: new Date('2026-02-25').getTime(),
  },
  {
    id: 'tx-202602-05',
    type: 'expense',
    amount: 210.0,
    category: 'bollette',
    description: 'Luce e riscaldamento',
    date: '2026-02-14',
    payer: 'Famiglia',
    createdAt: new Date('2026-02-14').getTime(),
  },
  {
    id: 'tx-202602-06',
    type: 'expense',
    amount: 165.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi tragitto casa-lavoro',
    date: '2026-02-20',
    payer: 'Andrea',
    createdAt: new Date('2026-02-20').getTime(),
  },

  // =====================
  // MARZO 2026
  // =====================
  {
    id: 'tx-202603-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-03-02',
    payer: 'Andrea',
    createdAt: new Date('2026-03-02').getTime(),
  },
  {
    id: 'tx-202603-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-03-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-03-05').getTime(),
  },
  {
    id: 'tx-202603-03',
    type: 'income',
    amount: 800,
    category: 'bonus_lavoro',
    description: 'Bonus lavoro premio produttività aziendale',
    date: '2026-03-25',
    payer: 'Andrea',
    notes: 'Premio di risultato 2025/2026',
    createdAt: new Date('2026-03-25').getTime(),
  },
  {
    id: 'tx-202603-04',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-03-18',
    payer: 'INPS',
    createdAt: new Date('2026-03-18').getTime(),
  },
  {
    id: 'tx-202603-05',
    type: 'expense',
    amount: 580.0,
    category: 'spesa_generica',
    description: 'Alimentari e spesa discount',
    date: '2026-03-28',
    payer: 'Famiglia',
    createdAt: new Date('2026-03-28').getTime(),
  },
  {
    id: 'tx-202603-06',
    type: 'expense',
    amount: 175.0,
    category: 'bollette',
    description: 'Bolletta luce Enel e internet',
    date: '2026-03-15',
    payer: 'Famiglia',
    createdAt: new Date('2026-03-15').getTime(),
  },
  {
    id: 'tx-202603-07',
    type: 'expense',
    amount: 185.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi mensili',
    date: '2026-03-22',
    payer: 'Andrea',
    createdAt: new Date('2026-03-22').getTime(),
  },

  // =====================
  // APRILE 2026
  // =====================
  {
    id: 'tx-202604-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-04-01',
    payer: 'Andrea',
    createdAt: new Date('2026-04-01').getTime(),
  },
  {
    id: 'tx-202604-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-04-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-04-05').getTime(),
  },
  {
    id: 'tx-202604-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-04-18',
    payer: 'INPS',
    createdAt: new Date('2026-04-18').getTime(),
  },
  {
    id: 'tx-202604-04',
    type: 'expense',
    amount: 590.0,
    category: 'spesa_generica',
    description: 'Spesa supermercato e Pasqua in famiglia',
    date: '2026-04-20',
    payer: 'Famiglia',
    createdAt: new Date('2026-04-20').getTime(),
  },
  {
    id: 'tx-202604-05',
    type: 'expense',
    amount: 165.0,
    category: 'bollette',
    description: 'Acqua e fibra internet',
    date: '2026-04-12',
    payer: 'Famiglia',
    createdAt: new Date('2026-04-12').getTime(),
  },
  {
    id: 'tx-202604-06',
    type: 'expense',
    amount: 175.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi gite primaverili',
    date: '2026-04-25',
    payer: 'Andrea',
    createdAt: new Date('2026-04-25').getTime(),
  },

  // =====================
  // MAGGIO 2026
  // =====================
  {
    id: 'tx-202605-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-05-02',
    payer: 'Andrea',
    createdAt: new Date('2026-05-02').getTime(),
  },
  {
    id: 'tx-202605-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-05-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-05-05').getTime(),
  },
  {
    id: 'tx-202605-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-05-18',
    payer: 'INPS',
    createdAt: new Date('2026-05-18').getTime(),
  },
  {
    id: 'tx-202605-03b',
    type: 'income',
    amount: 200,
    category: 'regali',
    description: 'Regalo di compleanno',
    date: '2026-05-18',
    payer: 'Famiglia',
    notes: 'Regali ricevuti per compleanno da parenti',
    createdAt: new Date('2026-05-18').getTime(),
  },
  {
    id: 'tx-202605-04',
    type: 'expense',
    amount: 555.0,
    category: 'spesa_generica',
    description: 'Spesa supermercato mensile',
    date: '2026-05-28',
    payer: 'Famiglia',
    createdAt: new Date('2026-05-28').getTime(),
  },
  {
    id: 'tx-202605-05',
    type: 'expense',
    amount: 150.0,
    category: 'bollette',
    description: 'Luce e rifiuti TARI acconto',
    date: '2026-05-16',
    payer: 'Famiglia',
    createdAt: new Date('2026-05-16').getTime(),
  },
  {
    id: 'tx-202605-06',
    type: 'expense',
    amount: 170.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi autostradali',
    date: '2026-05-22',
    payer: 'Andrea',
    createdAt: new Date('2026-05-22').getTime(),
  },

  // =====================
  // GIUGNO 2026 (con 14ESIMA!)
  // =====================
  {
    id: 'tx-202606-01',
    type: 'income',
    amount: 3800,
    category: 'stipendio',
    description: 'Stipendio principale (comprensivo di 14esima)',
    date: '2026-06-01',
    payer: 'Andrea',
    notes: 'Busta paga giugno con 14esima mensilità inclusa come valore unico',
    createdAt: new Date('2026-06-01').getTime(),
  },
  {
    id: 'tx-202606-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-06-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-06-05').getTime(),
  },
  {
    id: 'tx-202606-04',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-06-18',
    payer: 'INPS',
    createdAt: new Date('2026-06-18').getTime(),
  },
  {
    id: 'tx-202606-05',
    type: 'expense',
    amount: 560.0,
    category: 'spesa_generica',
    description: 'Spesa supermercato mensile',
    date: '2026-06-29',
    payer: 'Famiglia',
    createdAt: new Date('2026-06-29').getTime(),
  },
  {
    id: 'tx-202606-07',
    type: 'expense',
    amount: 170.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi tragitto casa-lavoro',
    date: '2026-06-22',
    payer: 'Andrea',
    createdAt: new Date('2026-06-22').getTime(),
  },
  {
    id: 'tx-202606-08',
    type: 'expense',
    amount: 155.0,
    category: 'bollette',
    description: 'Bollette utenze luce e tari',
    date: '2026-06-12',
    payer: 'Famiglia',
    createdAt: new Date('2026-06-12').getTime(),
  },

  // =====================
  // LUGLIO 2026 (con rimborso 730 nello stipendio)
  // =====================
  {
    id: 'tx-202607-01',
    type: 'income',
    amount: 2900,
    category: 'stipendio',
    description: 'Stipendio principale (comprensivo di rimborso 730)',
    date: '2026-07-01',
    payer: 'Andrea',
    notes: 'Busta paga luglio con credito rimborso 730 incluso come valore unico',
    createdAt: new Date('2026-07-01').getTime(),
  },
  {
    id: 'tx-202607-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-07-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-07-05').getTime(),
  },
  {
    id: 'tx-202607-04',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-07-18',
    payer: 'INPS',
    createdAt: new Date('2026-07-18').getTime(),
  },
  {
    id: 'tx-202607-05',
    type: 'expense',
    amount: 410.0,
    category: 'assicurazioni',
    description: 'Assicurazione Auto RCA + Furto/Incendio',
    date: '2026-07-14',
    payer: 'Andrea',
    notes: 'Rinnovo polizza Genertel annuale',
    createdAt: new Date('2026-07-14').getTime(),
  },
  {
    id: 'tx-202607-06',
    type: 'expense',
    amount: 540.0,
    category: 'spesa_generica',
    description: 'Spesa alimentari mese di luglio',
    date: '2026-07-28',
    payer: 'Famiglia',
    createdAt: new Date('2026-07-28').getTime(),
  },
  {
    id: 'tx-202607-07',
    type: 'expense',
    amount: 175.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi mensili',
    date: '2026-07-20',
    payer: 'Andrea',
    createdAt: new Date('2026-07-20').getTime(),
  },
  {
    id: 'tx-202607-08',
    type: 'expense',
    amount: 145.0,
    category: 'bollette',
    description: 'Luce e climatizzazione',
    date: '2026-07-11',
    payer: 'Famiglia',
    createdAt: new Date('2026-07-11').getTime(),
  },

  // =====================
  // AGOSTO 2026
  // =====================
  {
    id: 'tx-202608-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-08-01',
    payer: 'Andrea',
    createdAt: new Date('2026-08-01').getTime(),
  },
  {
    id: 'tx-202608-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-08-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-08-05').getTime(),
  },
  {
    id: 'tx-202608-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-08-18',
    payer: 'INPS',
    createdAt: new Date('2026-08-18').getTime(),
  },
  {
    id: 'tx-202608-04',
    type: 'expense',
    amount: 620.0,
    category: 'spesa_generica',
    description: 'Supermercato e alimentari ferie',
    date: '2026-08-20',
    payer: 'Famiglia',
    createdAt: new Date('2026-08-20').getTime(),
  },
  {
    id: 'tx-202608-05',
    type: 'expense',
    amount: 220.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi viaggi estivi',
    date: '2026-08-18',
    payer: 'Andrea',
    createdAt: new Date('2026-08-18').getTime(),
  },
  {
    id: 'tx-202608-06',
    type: 'expense',
    amount: 160.0,
    category: 'bollette',
    description: 'Acqua e luce estiva',
    date: '2026-08-10',
    payer: 'Famiglia',
    createdAt: new Date('2026-08-10').getTime(),
  },
  {
    id: 'tx-202608-07',
    type: 'expense',
    amount: 340.0,
    category: 'altre_uscite',
    description: 'Spese vacanze estive e cene',
    date: '2026-08-15',
    payer: 'Famiglia',
    createdAt: new Date('2026-08-15').getTime(),
  },

  // =====================
  // SETTEMBRE 2026 (con BOLLO AUTO!)
  // =====================
  {
    id: 'tx-202609-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-09-01',
    payer: 'Andrea',
    createdAt: new Date('2026-09-01').getTime(),
  },
  {
    id: 'tx-202609-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-09-05',
    payer: 'Famiglia',
    createdAt: new Date('2026-09-05').getTime(),
  },
  {
    id: 'tx-202609-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-09-18',
    payer: 'INPS',
    createdAt: new Date('2026-09-18').getTime(),
  },
  {
    id: 'tx-202609-04',
    type: 'expense',
    amount: 585.5,
    category: 'spesa_generica',
    description: 'Spese alimentari mensili Coop ed Esselunga',
    date: '2026-09-28',
    payer: 'Famiglia',
    createdAt: new Date('2026-09-28').getTime(),
  },
  {
    id: 'tx-202609-06',
    type: 'expense',
    amount: 185.0,
    category: 'carburante_pedaggi',
    description: 'Carburante e pedaggi mensili pendolarismo',
    date: '2026-09-24',
    payer: 'Andrea',
    createdAt: new Date('2026-09-24').getTime(),
  },
  {
    id: 'tx-202609-07',
    type: 'expense',
    amount: 195.4,
    category: 'bollette',
    description: 'Bolletta Gas e Riscaldamento',
    date: '2026-09-18',
    payer: 'Famiglia',
    createdAt: new Date('2026-09-18').getTime(),
  },
  {
    id: 'tx-202609-08',
    type: 'expense',
    amount: 110.0,
    category: 'scuola',
    description: 'Materiale scolastico e cancelleria',
    date: '2026-09-08',
    payer: 'Famiglia',
    createdAt: new Date('2026-09-08').getTime(),
  },

  // =====================
  // OTTOBRE 2026 (Mese corrente)
  // =====================
  {
    id: 'tx-202610-01',
    type: 'income',
    amount: 1950,
    category: 'stipendio',
    description: 'Stipendio principale',
    date: '2026-10-02',
    payer: 'Andrea',
    notes: 'Busta paga mese corrente',
    createdAt: new Date('2026-10-02').getTime(),
  },
  {
    id: 'tx-202610-02',
    type: 'income',
    amount: 1650,
    category: 'stipendio',
    description: 'Stipendio partner',
    date: '2026-10-05',
    payer: 'Famiglia',
    notes: 'Accredito conto cointestato',
    createdAt: new Date('2026-10-05').getTime(),
  },
  {
    id: 'tx-202610-03',
    type: 'income',
    amount: 350,
    category: 'assegno_figli',
    description: 'Assegno Unico INPS figli a carico',
    date: '2026-10-07',
    payer: 'INPS',
    notes: 'Accredito mensile INPS',
    createdAt: new Date('2026-10-07').getTime(),
  },
  {
    id: 'tx-202610-04',
    type: 'expense',
    amount: 145.8,
    category: 'spesa_generica',
    description: 'Supermercato Esselunga spesa settimanale',
    date: '2026-10-03',
    payer: 'Famiglia',
    notes: 'Alimentari e prodotti casa',
    createdAt: new Date('2026-10-03').getTime(),
  },
  {
    id: 'tx-202610-05',
    type: 'expense',
    amount: 70.0,
    category: 'carburante_pedaggi',
    description: 'Pieno carburante e pedaggi Eni Station',
    date: '2026-10-04',
    payer: 'Andrea',
    notes: 'Benzina verde 95',
    createdAt: new Date('2026-10-04').getTime(),
  },
  {
    id: 'tx-202610-06',
    type: 'expense',
    amount: 112.4,
    category: 'bollette',
    description: 'Bolletta Enel Energia (Luce)',
    date: '2026-10-06',
    payer: 'Famiglia',
    notes: 'Bimestre settembre-ottobre',
    createdAt: new Date('2026-10-06').getTime(),
  },
  {
    id: 'tx-202610-07',
    type: 'expense',
    amount: 29.9,
    category: 'bollette',
    description: 'Fibra Internet Fastweb',
    date: '2026-10-05',
    payer: 'Famiglia',
    notes: 'Addebito SDD mensile',
    createdAt: new Date('2026-10-05').getTime(),
  },
  {
    id: 'tx-202610-08',
    type: 'expense',
    amount: 115.0,
    category: 'condominio',
    description: 'Rata condominio ordinaria',
    date: '2026-10-04',
    payer: 'Famiglia',
    notes: 'Spese condominiali e riscaldamento',
    createdAt: new Date('2026-10-04').getTime(),
  },
  {
    id: 'tx-202610-09',
    type: 'expense',
    amount: 85.0,
    category: 'scuola',
    description: 'Buoni mensa scolastica',
    date: '2026-10-05',
    payer: 'Famiglia',
    notes: 'Ricarica mensa bambini',
    createdAt: new Date('2026-10-05').getTime(),
  },
  {
    id: 'tx-202610-10',
    type: 'expense',
    amount: 70.0,
    category: 'corsi',
    description: 'Corso nuoto bambini',
    date: '2026-10-06',
    payer: 'Andrea',
    notes: 'Quota mensile piscina',
    createdAt: new Date('2026-10-06').getTime(),
  },
  {
    id: 'tx-202610-11',
    type: 'expense',
    amount: 65.0,
    category: 'vestiario_bambini',
    description: 'Scarpe e abbigliamento bimbi',
    date: '2026-10-07',
    payer: 'Famiglia',
    notes: 'Scarpe ginnastica e ricambi',
    createdAt: new Date('2026-10-07').getTime(),
  },
  {
    id: 'tx-202610-12',
    type: 'expense',
    amount: 45.0,
    category: 'extra',
    description: 'Regalo compleanno compagno scuola',
    date: '2026-10-08',
    payer: 'Famiglia',
    notes: 'Festa di compleanno',
    createdAt: new Date('2026-10-08').getTime(),
  },

  // =====================
  // DICEMBRE 2026 (con 13esima nello stipendio e Regali di Natale)
  // =====================
  {
    id: 'tx-202612-01',
    type: 'income',
    amount: 3900,
    category: 'stipendio',
    description: 'Stipendio Andrea (comprensivo di 13esima)',
    date: '2026-12-15',
    payer: 'Andrea',
    notes: 'Busta paga dicembre con 13esima inclusa come valore unico nello stipendio',
    createdAt: new Date('2026-12-15').getTime(),
  },
  {
    id: 'tx-202612-02',
    type: 'income',
    amount: 3300,
    category: 'stipendio',
    description: 'Stipendio partner (comprensivo di 13esima)',
    date: '2026-12-15',
    payer: 'Famiglia',
    notes: 'Busta paga dicembre partner con 13esima inclusa',
    createdAt: new Date('2026-12-15').getTime(),
  },
  {
    id: 'tx-202612-03',
    type: 'income',
    amount: 400,
    category: 'regali',
    description: 'Regali di Natale da parenti e famiglia',
    date: '2026-12-24',
    payer: 'Famiglia',
    notes: 'Regali monetari per festività natalizie',
    createdAt: new Date('2026-12-24').getTime(),
  },
];

/**
 * Generate 12 monthly installments for periodic expenses (bollo auto, tari, assicurazione auto, tagliando auto)
 * evenly spread across all 12 months of 2026.
 */
function generatePeriodicExpenseTransactions(): Transaction[] {
  const periodicList: {
    category: ExpenseCategory;
    description: string;
    totalAmount: number;
    payer: string;
    day: number;
  }[] = [
    {
      category: 'bollo_auto',
      description: 'Bollo auto annuale',
      totalAmount: 240,
      payer: 'Andrea',
      day: 12,
    },
    {
      category: 'tari',
      description: 'TARI Tassa rifiuti comunale',
      totalAmount: 300,
      payer: 'Famiglia',
      day: 16,
    },
    {
      category: 'assicurazioni',
      description: 'Assicurazione auto RCA e polizze',
      totalAmount: 480,
      payer: 'Famiglia',
      day: 10,
    },
    {
      category: 'tagliando_auto',
      description: 'Tagliando e manutenzione auto',
      totalAmount: 240,
      payer: 'Andrea',
      day: 18,
    },
  ];

  const results: Transaction[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthStr = String(m).padStart(2, '0');
    periodicList.forEach((item) => {
      const monthlyAmount = Math.round((item.totalAmount / 12) * 100) / 100;
      results.push({
        id: `tx-seed-${item.category}-2026${monthStr}`,
        type: 'expense',
        amount: monthlyAmount,
        category: item.category,
        description: `${item.description} (Quota spalmata ${m}/12 - €${monthlyAmount}/m)`,
        date: `2026-${monthStr}-${String(item.day).padStart(2, '0')}`,
        payer: item.payer,
        notes: `Spalmata sui 12 mesi dell'anno (Totale annuo €${item.totalAmount.toFixed(2)})`,
        createdAt: new Date(`2026-${monthStr}-${String(item.day).padStart(2, '0')}`).getTime(),
        isSplitOver12Months: true,
        splitYear: 2026,
        originalTotalAmount: item.totalAmount,
      });
    });
  }
  return results;
}

export function getDefaultBudgetData(): FamilyBudgetData {
  return {
    version: 5,
    updatedAt: new Date().toISOString(),
    targetMonthlySavings: 1000,
    defaultUserEmail: DEFAULT_USER_EMAIL,
    transactions: [...INITIAL_SEED_TRANSACTIONS, ...generatePeriodicExpenseTransactions()],
  };
}

export function loadLocalBudgetData(): FamilyBudgetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultBudgetData();
      saveLocalBudgetData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.transactions || !Array.isArray(parsed.transactions) || parsed.version !== 5) {
      // If version is older, migrate transactions: 13esima, 14esima, 730 into stipendio; benzina -> carburante_pedaggi
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        const migratedTransactions = parsed.transactions.map((tx: any) => {
          let updatedCategory = tx.category;
          let notes = tx.notes;
          let description = tx.description;

          if (
            updatedCategory === 'tredicesima' ||
            updatedCategory === 'quattordicesima' ||
            updatedCategory === 'rimborsi_730'
          ) {
            updatedCategory = 'stipendio';
            notes = notes
              ? `${notes} (Incluso nello stipendio mensile)`
              : 'Incluso come valore unico nello stipendio mensile';
          }

          if (updatedCategory === 'benzina') {
            updatedCategory = 'carburante_pedaggi';
            if (typeof description === 'string' && description.toLowerCase().includes('benzina')) {
              description = description.replace(/benzina/gi, 'carburante');
            }
          }

          return {
            ...tx,
            category: updatedCategory,
            description,
            notes,
          };
        });
        const migrated: FamilyBudgetData = {
          version: 5,
          updatedAt: new Date().toISOString(),
          targetMonthlySavings: parsed.targetMonthlySavings || 1000,
          defaultUserEmail: parsed.defaultUserEmail || DEFAULT_USER_EMAIL,
          transactions: migratedTransactions,
        };
        saveLocalBudgetData(migrated);
        return migrated;
      }
      const initial = getDefaultBudgetData();
      saveLocalBudgetData(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load local budget data:', err);
    return getDefaultBudgetData();
  }
}

export function saveLocalBudgetData(data: FamilyBudgetData): void {
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save budget data to localStorage:', err);
  }
}

/**
 * Wipe all transactions and reset data to a clean empty state
 */
export function clearAllLocalBudgetData(): FamilyBudgetData {
  const emptyData: FamilyBudgetData = {
    version: 5,
    updatedAt: new Date().toISOString(),
    targetMonthlySavings: 1000,
    defaultUserEmail: DEFAULT_USER_EMAIL,
    transactions: [],
  };
  saveLocalBudgetData(emptyData);
  return emptyData;
}

/**
 * Reset back to initial demo/seed data
 */
export function resetToSeedBudgetData(): FamilyBudgetData {
  const defaultData = getDefaultBudgetData();
  saveLocalBudgetData(defaultData);
  return defaultData;
}

export const MONTH_NAMES_IT = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];

/**
 * Returns formatted month label e.g. "Ottobre 2026"
 */
export function formatMonthKey(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  return `${MONTH_NAMES_IT[monthIdx] || ''} ${year}`;
}

/**
 * Extract all unique monthKeys (YYYY-MM) present in transactions, covering all 12 months of 2026
 */
export function getAllAvailableMonths(transactions: Transaction[]): string[] {
  const keys = new Set<string>();

  // Ensure all 12 months of 2026 are included
  for (let m = 1; m <= 12; m++) {
    keys.add(`2026-${String(m).padStart(2, '0')}`);
  }

  transactions.forEach((t) => {
    if (t.date && t.date.length >= 7) {
      keys.add(t.date.substring(0, 7));
    }
  });

  return Array.from(keys).sort((a, b) => b.localeCompare(a));
}

export interface PeriodicExpensesSummary {
  totalBolloAuto: number;
  totalTari: number;
  totalAssicurazioneAuto: number;
  totalTagliandoAuto: number;
  totalPeriodicAnnual: number;
  monthlyAveragePeriodic: number;
}

/**
 * Generate 12 monthly installments when user chooses to split an extra expense across the 12 months
 */
export function splitExpenseOver12Months(
  baseTx: Omit<Transaction, 'id' | 'createdAt'>,
  targetYear = 2026
): Transaction[] {
  const totalAmount = baseTx.amount;
  const monthlyAmount = Math.round((totalAmount / 12) * 100) / 100;
  const splitId = `split-exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = Date.now();

  const generated: Transaction[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthStr = String(m).padStart(2, '0');
    const installmentDate = `${targetYear}-${monthStr}-15`;
    generated.push({
      id: `tx-exp-${targetYear}${monthStr}-${splitId}-${m}`,
      type: 'expense',
      amount: monthlyAmount,
      category: baseTx.category,
      description: `${baseTx.description} (Quota spalmata ${m}/12 - €${monthlyAmount}/m)`,
      date: installmentDate,
      payer: baseTx.payer,
      notes: baseTx.notes
        ? `${baseTx.notes} | Spalmata sui 12 mesi (Totale annuo €${totalAmount.toFixed(2)})`
        : `Spalmata sui 12 mesi dell'anno (Totale annuo €${totalAmount.toFixed(2)})`,
      createdAt: now,
      isSplitOver12Months: true,
      splitYear: targetYear,
      originalTotalAmount: totalAmount,
      parentSplitId: splitId,
    });
  }

  return generated;
}

/**
 * Generate 12 monthly installments when user chooses to split an extra income across the 12 months
 */
export function splitIncomeOver12Months(
  baseTx: Omit<Transaction, 'id' | 'createdAt'>,
  targetYear = 2026
): Transaction[] {
  const totalAmount = baseTx.amount;
  const monthlyAmount = Math.round((totalAmount / 12) * 100) / 100;
  const splitId = `split-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = Date.now();

  const generated: Transaction[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthStr = String(m).padStart(2, '0');
    // Day 10 of each month
    const installmentDate = `${targetYear}-${monthStr}-10`;
    generated.push({
      id: `tx-${targetYear}${monthStr}-${splitId}-${m}`,
      type: 'income',
      amount: monthlyAmount,
      category: baseTx.category,
      description: `${baseTx.description} (Quota ${m}/12 - €${monthlyAmount}/m)`,
      date: installmentDate,
      payer: baseTx.payer,
      notes: baseTx.notes
        ? `${baseTx.notes} | Spalmata sui 12 mesi (Totale €${totalAmount.toFixed(2)})`
        : `Spalmata sui 12 mesi dell'anno (Totale annuo €${totalAmount.toFixed(2)})`,
      createdAt: now,
      isSplitOver12Months: true,
      splitYear: targetYear,
      originalTotalAmount: totalAmount,
      parentSplitId: splitId,
    });
  }

  return generated;
}

/**
 * Calculate stats for a specific month
 */
export function getEmptyExpenseByCategory(): Record<ExpenseCategory, number> {
  return {
    spesa_generica: 0,
    bollette: 0,
    condominio: 0,
    carburante_pedaggi: 0,
    scuola: 0,
    corsi: 0,
    vestiario_bambini: 0,
    assicurazioni: 0,
    bollo_auto: 0,
    tagliando_auto: 0,
    tari: 0,
    extra: 0,
    altre_uscite: 0,
  };
}

export function calculateMonthStats(transactions: Transaction[], monthKey: string): MonthStats {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthName = formatMonthKey(monthKey);

  const monthTx = transactions.filter((t) => t.date.startsWith(monthKey));

  const expenseByCategory: Record<ExpenseCategory, number> = getEmptyExpenseByCategory();

  const incomeByCategory: Record<IncomeCategory, number> = {
    stipendio: 0,
    bonus_lavoro: 0,
    assegno_figli: 0,
    regali: 0,
    rendita: 0,
    altre_entrate: 0,
  };

  let totalIncome = 0;
  let totalExpense = 0;

  monthTx.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
      const cat = tx.category as IncomeCategory;
      if (incomeByCategory[cat] !== undefined) {
        incomeByCategory[cat] += tx.amount;
      } else {
        incomeByCategory.altre_entrate += tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      const rawCat = tx.category === ('benzina' as any) ? 'carburante_pedaggi' : tx.category;
      const cat = rawCat as ExpenseCategory;
      if (expenseByCategory[cat] !== undefined) {
        expenseByCategory[cat] += tx.amount;
      } else {
        expenseByCategory.altre_uscite += tx.amount;
      }
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  return {
    monthKey,
    monthName,
    year,
    monthIndex,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    expenseByCategory,
    incomeByCategory,
    transactionsCount: monthTx.length,
  };
}

/**
 * Calculate historical monthly averages and extra incomes 12-month summary
 */
export function calculateAverageStats(transactions: Transaction[]): AverageStats {
  const months = getAllAvailableMonths(transactions);

  const emptyExtraSummary: ExtraIncomesSummary = {
    totalBonusLavoro: 0,
    totalAssegnoFigli: 0,
    totalRegali: 0,
    totalExtraAnnual: 0,
    monthlyAverageExtra: 0,
  };

  const emptyPeriodicSummary: PeriodicExpensesSummary = {
    totalBolloAuto: 0,
    totalTari: 0,
    totalAssicurazioneAuto: 0,
    totalTagliandoAuto: 0,
    totalPeriodicAnnual: 0,
    monthlyAveragePeriodic: 0,
  };

  if (months.length === 0) {
    return {
      monthsCount: 0,
      avgMonthlyIncome: 0,
      avgMonthlyExpense: 0,
      avgMonthlySavings: 0,
      avgSavingsRate: 0,
      avgByCategory: getEmptyExpenseByCategory(),
      totalCumulativeSavings: 0,
      extraIncomesSummary: emptyExtraSummary,
      periodicExpensesSummary: emptyPeriodicSummary,
    };
  }

  const monthStatsList = months.map((m) => calculateMonthStats(transactions, m));
  const validMonths = monthStatsList.filter((m) => m.transactionsCount > 0);
  const count = validMonths.length || 1;

  let sumIncome = 0;
  let sumExpense = 0;
  let sumSavings = 0;
  let totalCumulativeSavings = 0;

  const sumByCategory: Record<ExpenseCategory, number> = getEmptyExpenseByCategory();

  let maxExpense = -1;
  let maxExpenseMonth: { monthName: string; amount: number } | undefined;
  let maxSavings = -Infinity;
  let maxSavingsMonth: { monthName: string; amount: number } | undefined;

  validMonths.forEach((m) => {
    sumIncome += m.totalIncome;
    sumExpense += m.totalExpense;
    sumSavings += m.netSavings;
    totalCumulativeSavings += m.netSavings;

    (Object.keys(m.expenseByCategory) as ExpenseCategory[]).forEach((cat) => {
      sumByCategory[cat] += m.expenseByCategory[cat] || 0;
    });

    if (m.totalExpense > maxExpense) {
      maxExpense = m.totalExpense;
      maxExpenseMonth = { monthName: m.monthName, amount: m.totalExpense };
    }

    if (m.netSavings > maxSavings) {
      maxSavings = m.netSavings;
      maxSavingsMonth = { monthName: m.monthName, amount: m.netSavings };
    }
  });

  // Calculate Extra Incomes across the entire year 2026 (bonus lavoro, assegno figli, regali)
  let totalBonusLavoro = 0;
  let totalAssegnoFigli = 0;
  let totalRegali = 0;

  // Calculate Periodic Expenses across the entire year (bollo, tari, assicurazioni, tagliando)
  let totalBolloAuto = 0;
  let totalTari = 0;
  let totalAssicurazioneAuto = 0;
  let totalTagliandoAuto = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      if (tx.category === 'bonus_lavoro') totalBonusLavoro += tx.amount;
      else if (tx.category === 'assegno_figli') totalAssegnoFigli += tx.amount;
      else if (tx.category === 'regali') totalRegali += tx.amount;
    } else {
      const descLower = tx.description.toLowerCase();
      if (tx.category === 'bollo_auto' || descLower.includes('bollo')) {
        totalBolloAuto += tx.amount;
      } else if (tx.category === 'tari' || descLower.includes('tari') || descLower.includes('rifiuti')) {
        totalTari += tx.amount;
      } else if (
        tx.category === 'assicurazioni' ||
        descLower.includes('assicurazione') ||
        descLower.includes('polizza')
      ) {
        totalAssicurazioneAuto += tx.amount;
      } else if (
        tx.category === 'tagliando_auto' ||
        descLower.includes('tagliando') ||
        descLower.includes('revisione') ||
        descLower.includes('meccanico')
      ) {
        totalTagliandoAuto += tx.amount;
      }
    }
  });

  const totalExtraAnnual = totalBonusLavoro + totalAssegnoFigli + totalRegali;

  const monthlyAverageExtra = Math.round((totalExtraAnnual / 12) * 100) / 100;

  const extraIncomesSummary: ExtraIncomesSummary = {
    totalBonusLavoro: Math.round(totalBonusLavoro * 100) / 100,
    totalAssegnoFigli: Math.round(totalAssegnoFigli * 100) / 100,
    totalRegali: Math.round(totalRegali * 100) / 100,
    totalExtraAnnual: Math.round(totalExtraAnnual * 100) / 100,
    monthlyAverageExtra,
  };

  const totalPeriodicAnnual =
    totalBolloAuto + totalTari + totalAssicurazioneAuto + totalTagliandoAuto;
  const monthlyAveragePeriodic = Math.round((totalPeriodicAnnual / 12) * 100) / 100;

  const periodicExpensesSummary: PeriodicExpensesSummary = {
    totalBolloAuto: Math.round(totalBolloAuto * 100) / 100,
    totalTari: Math.round(totalTari * 100) / 100,
    totalAssicurazioneAuto: Math.round(totalAssicurazioneAuto * 100) / 100,
    totalTagliandoAuto: Math.round(totalTagliandoAuto * 100) / 100,
    totalPeriodicAnnual: Math.round(totalPeriodicAnnual * 100) / 100,
    monthlyAveragePeriodic,
  };

  const avgMonthlyIncome = Math.round((sumIncome / count) * 100) / 100;
  const avgMonthlyExpense = Math.round((sumExpense / count) * 100) / 100;
  const avgMonthlySavings = Math.round((sumSavings / count) * 100) / 100;
  const avgSavingsRate = avgMonthlyIncome > 0 ? Math.round((avgMonthlySavings / avgMonthlyIncome) * 100) : 0;

  const avgByCategory: Record<ExpenseCategory, number> = getEmptyExpenseByCategory();
  (Object.keys(sumByCategory) as ExpenseCategory[]).forEach((cat) => {
    avgByCategory[cat] = Math.round((sumByCategory[cat] / count) * 100) / 100;
  });

  return {
    monthsCount: count,
    avgMonthlyIncome,
    avgMonthlyExpense,
    avgMonthlySavings,
    avgSavingsRate,
    avgByCategory,
    totalCumulativeSavings,
    highestExpenseMonth: maxExpenseMonth,
    highestSavingsMonth: maxSavingsMonth,
    extraIncomesSummary,
    periodicExpensesSummary,
  };
}

/**
 * Currency formatter for EUR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
