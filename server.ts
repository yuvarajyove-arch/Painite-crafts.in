import express from 'express';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// Helper to get or lazily initialize Razorpay client
function getRazorpayConfig() {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_live_TV8Ghw1tG4RX3L';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '33HZgdRMWc8452oXoX6fsN4s';

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials not configured in environment');
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  });

  return { razorpay, key_id, key_secret };
}

// ==========================================
// 1. BACKEND - Payment Configuration
// ==========================================
app.get('/api/payment-config', (_req, res) => {
  try {
    const { key_id } = getRazorpayConfig();
    res.json({ key_id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve payment configuration' });
  }
});

// ==========================================
// 2. BACKEND - Create Razorpay Order
// Endpoint: POST /api/create-order
// ==========================================
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Minimum amount is 100 paise (₹1.00)
    const amountInPaise = Number(amount);
    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum payable amount must be at least ₹1 (100 paise).',
      });
    }

    const { razorpay, key_id } = getRazorpayConfig();

    const orderOptions = {
      amount: Math.round(amountInPaise),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: notes || {
        store: 'Painite Crafts',
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({
      error: error?.error?.description || error.message || 'Failed to create Razorpay order',
    });
  }
});

// ==========================================
// 3. BACKEND - Verify Payment Signature
// Endpoint: POST /api/verify-payment
// Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
// ==========================================
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters (order_id, payment_id, or signature).',
      });
    }

    const { key_secret } = getRazorpayConfig();

    // Compute HMAC-SHA256 signature
    const hmacPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(hmacPayload)
      .digest('hex');

    const genBuf = Buffer.from(generatedSignature, 'utf-8');
    const sigBuf = Buffer.from(razorpay_signature, 'utf-8');

    // Secure timing-safe comparison if lengths match
    const isSignatureValid =
      genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    if (isSignatureValid) {
      return res.json({
        success: true,
        message: 'Payment signature verified successfully.',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Tampered or invalid payload.',
      });
    }
  } catch (error: any) {
    console.error('Razorpay Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during signature verification.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Painite Crafts API' });
});

// ==========================================
// 4. Vite Middleware & Static Asset Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Painite Crafts server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
