import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sp_super_secret_change_in_prod';

// ── Wallet addresses ────────────────────────────────────────────────────────
const WALLETS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Network',
    address: 'bc1qsfuex7kgmy8fd4y6ldnjw6wq7m09gqe6ffm7ws',
    icon: '₿',
    color: '#f7931a',
    minDeposit: 0.0005,
    confirmations: 3
  },
  {
    id: 'usdt_trc20',
    name: 'Tether',
    symbol: 'USDT',
    network: 'TRC-20 (Tron)',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    confirmations: 20
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: 'Ξ',
    color: '#627eea',
    minDeposit: 0.005,
    confirmations: 12
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    network: 'BEP-20 (BSC)',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: '◆',
    color: '#f3ba2f',
    minDeposit: 0.01,
    confirmations: 15
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Network',
    address: '48fsQ9goLcnKKtqwFvcp5Bqp1onpRhQFT2Vzmr77C73n',
    icon: '◎',
    color: '#9945ff',
    minDeposit: 0.1,
    confirmations: 32
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    network: 'ERC-20',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: '$',
    color: '#2775ca',
    minDeposit: 10,
    confirmations: 12
  },
  {
    id: 'trx',
    name: 'Tron',
    symbol: 'TRX',
    network: 'TRC-20',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: '◈',
    color: '#ef0027',
    minDeposit: 50,
    confirmations: 20
  },
  {
    id: 'xrp',
    name: 'Ripple',
    symbol: 'XRP',
    network: 'XRP Ledger',
    address: '0xff9924609d50551Fa6157A4562e861A1A44F5888',
    icon: '✕',
    color: '#00aae4',
    minDeposit: 20,
    confirmations: 1
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    symbol: 'LTC',
    network: 'Litecoin Network',
    address: 'bc1qsfuex7kgmy8fd4y6ldnjw6wq7m09gqe6ffm7ws',
    icon: 'Ł',
    color: '#bfbbbb',
    minDeposit: 0.05,
    confirmations: 6
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    symbol: 'DOGE',
    network: 'Dogecoin Network',
    address: 'bc1qsfuex7kgmy8fd4y6ldnjw6wq7m09gqe6ffm7ws',
    icon: 'Ð',
    color: '#c2a633',
    minDeposit: 100,
    confirmations: 40
  }
];

// ── Auth middleware ──────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/deposit/wallets — return all supported crypto wallets
// ──────────────────────────────────────────────────────────────────────────────
router.get('/wallets', authenticate, (req, res) => {
  res.json({ wallets: WALLETS });
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/deposit/submit — user submits a deposit claim
// ──────────────────────────────────────────────────────────────────────────────
router.post('/submit', authenticate, (req, res) => {
  try {
    const { crypto, amount, tx_hash } = req.body;

    if (!crypto || !amount || !tx_hash) {
      return res.status(400).json({ error: 'Crypto, amount, and transaction hash are required.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount.' });
    }

    // Find wallet info
    const wallet = WALLETS.find(w => w.symbol.toLowerCase() === crypto.toLowerCase() || w.id === crypto);
    if (!wallet) {
      return res.status(400).json({ error: 'Unsupported cryptocurrency.' });
    }

    // Insert transaction as pending
    const result = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, crypto, wallet, tx_hash, status, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(req.userId, 'deposit', parsedAmount, wallet.symbol, wallet.address, tx_hash.trim(), 'pending', `${wallet.symbol} deposit via ${wallet.network}`);

    res.status(201).json({
      message: 'Deposit submitted successfully. It will be confirmed after network verification.',
      transaction: {
        id: result.lastInsertRowid,
        type: 'deposit',
        amount: parsedAmount,
        crypto: wallet.symbol,
        status: 'pending',
        tx_hash: tx_hash.trim()
      }
    });

  } catch (err) {
    console.error('Deposit submit error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/deposit/history — return user's transaction history
// ──────────────────────────────────────────────────────────────────────────────
router.get('/history', authenticate, (req, res) => {
  try {
    const transactions = db.prepare(
      'SELECT id, type, amount, crypto, tx_hash, status, note, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(req.userId);

    res.json({ transactions });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
