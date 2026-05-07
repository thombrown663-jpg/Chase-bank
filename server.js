const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const { emitWarning } = process;
process.emitWarning = (w, ...a) => { if (typeof w === 'string' && w.includes('MemoryStore')) return; emitWarning(w, ...a); };
const session = require('express-session');
process.emitWarning = emitWarning;

// ─────────────────────────────────────────
//  USER ACCOUNTS  (keyed by username)
// ─────────────────────────────────────────
const USERS = {

  'KellyC_2021': {
    password: 'beloyal246',
    name: 'Kelly Christopher',
    initials: 'KC',
    email: 'kellychristopher581@gmail.com',
    phone: '(***) ***-4821',
    address: '245 Park Ave, New York, NY 10167',
    memberSince: 'March 2018',
    checking: { balance: 2200000,  number: '4821', routing: '021000021' },
    savings:  { balance: 800000,   number: '7934', routing: '021000021' },
    total: 3000000,
    creditCard: {
      last4: '3391', type: 'Chase Sapphire Preferred®',
      limit: 50000, balance: 4218.74, available: 45781.26,
      dueDate: 'May 3, 2021', minPayment: 35.00
    },
    investments: [
      { ticker: 'AAPL', name: 'Apple Inc.',         shares: 120,  price: 174.23, change: +2.14, pct: +1.24, value: 20907.60 },
      { ticker: 'MSFT', name: 'Microsoft Corp.',     shares: 85,   price: 415.10, change: +5.30, pct: +1.29, value: 35283.50 },
      { ticker: 'AMZN', name: 'Amazon.com Inc.',     shares: 60,   price: 185.07, change: -1.22, pct: -0.65, value: 11104.20 },
      { ticker: 'TSLA', name: 'Tesla Inc.',           shares: 200,  price: 177.48, change: +8.91, pct: +5.28, value: 35496.00 },
      { ticker: 'NVDA', name: 'NVIDIA Corp.',         shares: 150,  price: 788.17, change: +14.20,pct: +1.83, value: 118225.50},
    ],
    transactions: [
      { icon:'dep', emoji:'💵', name:'Salary Deposit',         detail:'Direct Deposit',      date:'Apr 5, 2021 · 8:02 AM',   amount:'+$5,200.00',  pos:true,  status:'Completed' },
      { icon:'wd',  emoji:'🛒', name:'Grocery Purchase',        detail:'Whole Foods Market',  date:'Apr 4, 2021 · 3:47 PM',   amount:'−$87.45',     pos:false, status:'Completed' },
      { icon:'tr',  emoji:'🔄', name:'Transfer to Savings',     detail:'Chase ••7934',        date:'Apr 3, 2021 · 11:15 AM',  amount:'−$1,000.00',  pos:false, status:'Completed' },
      { icon:'bl',  emoji:'⚡', name:'Utility Bill',            detail:'Con Edison',          date:'Apr 2, 2021 · 9:30 AM',   amount:'−$124.30',    pos:false, status:'Completed' },
      { icon:'zl',  emoji:'⚡', name:'Zelle® Payment Received', detail:'From Marcus T.',      date:'Apr 1, 2021 · 6:55 PM',   amount:'+$350.00',    pos:true,  status:'Completed' },
      { icon:'wd',  emoji:'🍽️', name:'Restaurant',              detail:'Nobu Restaurant NYC', date:'Mar 31, 2021 · 8:12 PM',  amount:'−$214.60',    pos:false, status:'Completed' },
      { icon:'atm', emoji:'🏧', name:'ATM Withdrawal',          detail:'Chase ATM #04821',    date:'Mar 30, 2021 · 1:20 PM',  amount:'−$400.00',    pos:false, status:'Completed' },
      { icon:'dep', emoji:'💵', name:'Wire Transfer Received',  detail:'JPMorgan',            date:'Mar 29, 2021 · 10:05 AM', amount:'+$12,500.00', pos:true,  status:'Completed' },
      { icon:'bl',  emoji:'🌐', name:'Internet & Cable Bill',   detail:'Spectrum',            date:'Mar 28, 2021 · 7:00 AM',  amount:'−$89.99',     pos:false, status:'Completed' },
      { icon:'wd',  emoji:'✈️', name:'Flight Booking',          detail:'Delta Airlines',      date:'Mar 27, 2021 · 2:38 PM',  amount:'−$548.00',    pos:false, status:'Completed' },
    ]
  },

  'Stanley133': {
    password: 'Success12',
    name: 'Stanley Maeschen',
    initials: 'SM',
    email: 'stanleymaeschen4@gmail.com',
    phone: '(***) ***-3047',
    customerService: '1-800-935-9935',
    address: '2811 Marietta Ave, Lancaster, PA 17601',
    memberSince: 'January 2022',
    checking: { balance: 180568.96, number: '3047', routing: '021000021' },
    savings:  { balance: 70000.00,  number: '6612', routing: '021000021' },
    total: 250568.96,
    creditCard: {
      last4: '7714', type: 'Mastercard Platinum',
      network: 'Mastercard',
      limit: 15000, balance: 892.50, available: 14107.50,
      dueDate: 'Apr 18, 2026', minPayment: 25.00
    },
    investments: [
      { ticker: 'SPY',  name: 'SPDR S&P 500 ETF',    shares: 10,  price: 521.34, change: +3.10, pct: +0.60, value: 5213.40  },
      { ticker: 'AAPL', name: 'Apple Inc.',           shares: 15,  price: 174.23, change: +2.14, pct: +1.24, value: 2613.45  },
      { ticker: 'VTI',  name: 'Vanguard Total Market',shares: 20,  price: 244.10, change: +1.05, pct: +0.43, value: 4882.00  },
      { ticker: 'GOOGL',name: 'Alphabet Inc.',        shares: 8,   price: 178.02, change: -0.88, pct: -0.49, value: 1424.16  },
    ],
    transactions: [
      { icon:'dep', emoji:'💵', name:'Salary Deposit',       detail:'Direct Deposit',     date:'Mar 31, 2026 · 8:00 AM',  amount:'+$4,800.00', pos:true,  status:'Completed' },
      { icon:'wd',  emoji:'🛒', name:'Grocery Purchase',      detail:'Walmart Supercenter',date:'Mar 29, 2026 · 5:22 PM',  amount:'−$63.14',    pos:false, status:'Completed' },
      { icon:'bl',  emoji:'⚡', name:'Electric Bill',         detail:'Duke Energy',        date:'Mar 27, 2026 · 9:00 AM',  amount:'−$98.50',    pos:false, status:'Completed' },
      { icon:'tr',  emoji:'🔄', name:'Transfer to Savings',   detail:'Chase ••6612',       date:'Mar 25, 2026 · 12:10 PM', amount:'−$500.00',   pos:false, status:'Completed' },
      { icon:'zl',  emoji:'⚡', name:'Zelle® Received',       detail:'From James W.',      date:'Mar 22, 2026 · 3:44 PM',  amount:'+$200.00',   pos:true,  status:'Completed' },
      { icon:'wd',  emoji:'⛽', name:'Gas Station',           detail:'Shell #4412',        date:'Mar 20, 2026 · 7:55 AM',  amount:'−$54.80',    pos:false, status:'Completed' },
      { icon:'bl',  emoji:'📱', name:'Phone Bill',            detail:'AT&T Wireless',      date:'Mar 17, 2026 · 8:00 AM',  amount:'−$85.00',    pos:false, status:'Completed' },
      { icon:'wd',  emoji:'🍽️', name:'Restaurant',            detail:'Olive Garden',       date:'Mar 14, 2026 · 7:30 PM',  amount:'−$47.20',    pos:false, status:'Completed' },
      { icon:'dep', emoji:'💵', name:'Tax Refund',            detail:'IRS Direct Deposit', date:'Mar 10, 2026 · 10:15 AM', amount:'+$1,240.00', pos:true,  status:'Completed' },
      { icon:'atm', emoji:'🏧', name:'ATM Withdrawal',        detail:'Chase ATM #03047',   date:'Mar 7, 2026 · 2:00 PM',   amount:'−$200.00',   pos:false, status:'Completed' },
    ]
  },

  // ── James Hughson — LOCKED account ──
  'JamesH_0510': {
    password: 'Hughs@2026',
    name: 'James Hughson',
    initials: 'JH',
    email: 'jameshughson@gmail.com',
    phone: '(***) ***-5589',
    customerService: '1-800-935-9935',
    address: '1234 S 3rd St, Louisville, KY 40208',
    memberSince: 'March 2021',
    isLocked: true,
    lockedDate: 'Tuesday, May 5, 2026',
    lockedReason: 'Due to suspicious activity detected on your account, all access and transactions have been placed on hold until further notice. Please contact Chase support immediately.',
    checking: { balance: 180568.96, number: '5589', routing: '021000021' },
    savings:  { balance: 70000.00,  number: '8823', routing: '021000021' },
    total: 250568.96,
    creditCard: {
      last4: '3392', type: 'Mastercard Platinum',
      network: 'Mastercard',
      limit: 15000, balance: 1204.75, available: 13795.25,
      dueDate: 'May 18, 2026', minPayment: 25.00
    },
    investments: [
      { ticker: 'SPY',  name: 'SPDR S&P 500 ETF',     shares: 10, price: 521.34, change: +3.10, pct: +0.60, value: 5213.40 },
      { ticker: 'AAPL', name: 'Apple Inc.',            shares: 15, price: 174.23, change: +2.14, pct: +1.24, value: 2613.45 },
      { ticker: 'VTI',  name: 'Vanguard Total Market', shares: 20, price: 244.10, change: +1.05, pct: +0.43, value: 4882.00 },
      { ticker: 'GOOGL',name: 'Alphabet Inc.',         shares: 8,  price: 178.02, change: -0.88, pct: -0.49, value: 1424.16 },
    ],
    transactions: [
      { icon:'dep', emoji:'💵', name:'Salary Deposit',        detail:'Direct Deposit',       date:'May 5, 2026 · 8:00 AM',   amount:'+$4,800.00', pos:true,  status:'Completed' },
      { icon:'wd',  emoji:'🍽️', name:'Restaurant – Chili\'s', detail:'Chilis Bar & Grill',   date:'May 4, 2026 · 7:45 PM',   amount:'−$62.30',    pos:false, status:'Completed' },
      { icon:'wd',  emoji:'🍔', name:'Fast Food',             detail:'McDonald\'s #3812',    date:'May 4, 2026 · 1:15 PM',   amount:'−$14.90',    pos:false, status:'Completed' },
      { icon:'wd',  emoji:'🛒', name:'Grocery Purchase',      detail:'Kroger Supermarket',   date:'May 3, 2026 · 4:30 PM',   amount:'−$88.47',    pos:false, status:'Completed' },
      { icon:'bl',  emoji:'⚡', name:'Electric Bill',         detail:'LG&E Energy',          date:'May 2, 2026 · 9:00 AM',   amount:'−$112.60',   pos:false, status:'Completed' },
      { icon:'zl',  emoji:'⚡', name:'Zelle® Received',       detail:'From Karen H.',        date:'May 1, 2026 · 2:20 PM',   amount:'+$300.00',   pos:true,  status:'Completed' },
      { icon:'tr',  emoji:'🔄', name:'Transfer to Savings',   detail:'Chase ••8823',         date:'Apr 30, 2026 · 11:05 AM', amount:'−$500.00',   pos:false, status:'Completed' },
      { icon:'wd',  emoji:'⛽', name:'Gas Station',           detail:'BP #2201',             date:'Apr 28, 2026 · 7:40 AM',  amount:'−$58.20',    pos:false, status:'Completed' },
      { icon:'bl',  emoji:'📱', name:'Phone Bill',            detail:'T-Mobile',             date:'Apr 25, 2026 · 8:00 AM',  amount:'−$85.00',    pos:false, status:'Completed' },
      { icon:'dep', emoji:'💵', name:'Tax Refund',            detail:'IRS Direct Deposit',   date:'Apr 22, 2026 · 10:30 AM', amount:'+$1,560.00', pos:true,  status:'Completed' },
      { icon:'atm', emoji:'🏧', name:'ATM Withdrawal',        detail:'Chase ATM #05589',     date:'Apr 20, 2026 · 3:15 PM',  amount:'−$200.00',   pos:false, status:'Completed' },
      { icon:'wd',  emoji:'🏥', name:'Pharmacy',              detail:'CVS Pharmacy #0441',   date:'Apr 18, 2026 · 12:00 PM', amount:'−$34.99',    pos:false, status:'Completed' },
    ]
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chase-mvp-persistent-secret-key',
  resave: false, saveUninitialized: false, rolling: true,
  cookie: { secure: false, httpOnly: true, maxAge: 1000*60*60*24*30 }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/login');
}

app.get('/',          (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login',     (req, res) => { if (req.session?.loggedIn) return res.redirect('/dashboard'); res.sendFile(path.join(__dirname, 'public', 'login.html')); });
app.get('/dashboard', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const key = username && username.trim();
  const user = USERS[key];
  if (user && password === user.password) {
    req.session.loggedIn = true;
    req.session.username = key;
    return res.redirect('/dashboard');
  }
  res.redirect('/login?error=1');
});

app.get('/api/me', requireAuth, (req, res) => {
  const user = USERS[req.session.username];
  if (!user) return res.status(401).json({ error: 'Not found' });
  const { password, ...safe } = user;
  res.json({ ...safe, username: req.session.username });
});

// ── Live stock prices — fetched server-side, no CORS issues ──
app.get('/api/stocks', requireAuth, async (req, res) => {
  const tickers = (req.query.symbols || '').split(',').filter(Boolean);
  if (!tickers.length) return res.json({ quotes: [] });

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join('%2C')}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName`;

  try {
    const https = require('https');
    const data = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'query1.finance.yahoo.com',
        path: `/v7/finance/quote?symbols=${tickers.join('%2C')}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      };
      const req2 = https.get(options, (r) => {
        let body = '';
        r.on('data', chunk => body += chunk);
        r.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch(e) { reject(e); }
        });
      });
      req2.on('error', reject);
      req2.setTimeout(8000, () => { req2.destroy(); reject(new Error('timeout')); });
    });

    const quotes = (data?.quoteResponse?.result || []).map(q => ({
      symbol:     q.symbol,
      price:      q.regularMarketPrice,
      change:     q.regularMarketChange,
      changePct:  q.regularMarketChangePercent,
    }));

    res.json({ quotes, ts: Date.now() });

  } catch (err) {
    // Return empty so client falls back to simulation
    res.json({ quotes: [], error: err.message });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => { res.clearCookie('connect.sid'); res.redirect('/'); });
});

app.use((req, res) => res.status(404).redirect('/'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  Chase MVP on port ${PORT}`);
  console.log(`    KellyC_2021 / beloyal246`);
  console.log(`    Stanley133  / Success12`);
});
