import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_food_tokens';

const DB_NAME = 'dxm26';
const ADMIN_EMAIL = 'esakkimuthu2907@gmail.com';
const ADMIN_PASSWORD = 'Esakki@123';

let cachedClient = null;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Go to Vercel → Settings → Environment Variables and add MONGODB_URI.');
  
  if (cachedClient) {
    try {
      // Quick ping to check if topology is closed/broken
      await cachedClient.db('admin').command({ ping: 1 });
      return cachedClient.db(DB_NAME);
    } catch (error) {
      console.log('MongoDB ping failed (Topology closed?), reconnecting...', error.message);
      cachedClient = null;
    }
  }

  cachedClient = new MongoClient(uri, { 
    serverSelectionTimeoutMS: 10000, 
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000
  });
  await cachedClient.connect();
  
  return cachedClient.db(DB_NAME);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
  setCors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const fullUrl = req.url || '';
  const url = fullUrl.split('?')[0];

  try {
    // POST /api/auth
    if (url === '/api/auth' && req.method === 'POST') {
      const { email = '', password = '' } = await readBody(req);
      if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = Buffer.from(
          JSON.stringify({ email, role: 'admin', exp: Date.now() + 7 * 86400000 })
        ).toString('base64');
        return res.status(200).json({ success: true, token });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // GET /api/data/settings
    if (url === '/api/data/settings' && req.method === 'GET') {
      const db = await getDb();
      const settings = await db.collection('settings').findOne({ id: 'site_settings' });
      return res.status(200).json(settings || {
        id: 'site_settings',
        hero_title: "DXM '26",
        hero_subtitle: 'MECHANICAL SYMPOSIUM',
        hero_description: 'INNOVATE. DESIGN. INSPIRE.',
        stat_participants: '300',
        stat_colleges: '50+',
        stat_events: '10+',
        stat_workshops: '2',
        contact_phone: '+91 - 7904577032',
        contact_email: 'dxm26@velammal.edu.in',
        contact_address: 'Velammal Engineering College, Chennai, Tamil Nadu',
      });
    }

    // POST /api/data/settings
    if (url === '/api/data/settings' && req.method === 'POST') {
      const db = await getDb();
      const data = await readBody(req);
      await db.collection('settings').updateOne(
        { id: 'site_settings' },
        { $set: { ...data, id: 'site_settings' } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, ...data });
    }

    // GET /api/data/:collection
    const getMatch = url.match(/^\/api\/data\/([^/]+)$/);
    if (getMatch && req.method === 'GET') {
      const db = await getDb();
      const items = await db.collection(getMatch[1]).find({}).toArray();
      return res.status(200).json(items);
    }

    // POST /api/data/:collection
    if (getMatch && req.method === 'POST') {
      const db = await getDb();
      const data = await readBody(req);
      const newItem = { ...data, id: new ObjectId().toString(), created_at: new Date().toISOString() };
      await db.collection(getMatch[1]).insertOne(newItem);
      return res.status(200).json(newItem);
    }

    // PUT /api/data/:collection/:id
    const putMatch = url.match(/^\/api\/data\/([^/]+)\/([^/]+)$/);
    if (putMatch && req.method === 'PUT') {
      const db = await getDb();
      const data = await readBody(req);
      delete data._id;
      const updated = { ...data, updated_at: new Date().toISOString() };
      await db.collection(putMatch[1]).updateOne({ id: putMatch[2] }, { $set: updated });
      return res.status(200).json({ ...updated, id: putMatch[2] });
    }

    // DELETE /api/data/:collection/:id
    if (putMatch && req.method === 'DELETE') {
      const db = await getDb();
      await db.collection(putMatch[1]).deleteOne({ id: putMatch[2] });
      return res.status(200).json({ success: true });
    }

    // --- FOOD TOKEN SYSTEM ENDPOINTS ---
    if (url.startsWith('/api/food/')) {
      const db = await getDb();
      const foodTokensCol = db.collection('food_tokens');

      if (url === '/api/food/register' && req.method === 'POST') {
        const data = await readBody(req);
        const { name, college_name, email, mobile, reg_id, password, food_type } = data;
        
        // Check if email already registered
        const existing = await foodTokensCol.findOne({ email });
        if (existing) {
          if (existing.status === 'Rejected') {
            // Allow re-submission
            const hashedPassword = await bcrypt.hash(password, 10);
            await foodTokensCol.updateOne({ _id: existing._id }, {
              $set: {
                name, college_name, mobile, reg_id, food_type,
                password: hashedPassword,
                status: 'Pending',
                rejection_reason: null,
                created_at: new Date().toISOString()
              }
            });
            return res.status(200).json({ success: true, message: 'Request re-submitted successfully' });
          }
          return res.status(400).json({ error: 'Email already registered and is not rejected' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newToken = {
          name, college_name, email, mobile, reg_id, food_type,
          password: hashedPassword,
          status: 'Pending',
          token_id: null,
          qr_code: null,
          created_at: new Date().toISOString(),
          approved_at: null,
          rejection_reason: null,
          redeemed: false
        };
        await foodTokensCol.insertOne(newToken);
        return res.status(200).json({ success: true, message: 'Request submitted successfully' });
      }

      if (url === '/api/food/login' && req.method === 'POST') {
        const { email, password } = await readBody(req);
        const user = await foodTokensCol.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email, role: 'participant' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ success: true, token });
      }

      // Helper to verify JWT
      const verifyToken = (req) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error('No token provided');
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
      };

      if (url === '/api/food/me' && req.method === 'GET') {
        try {
          const decoded = verifyToken(req);
          const user = await foodTokensCol.findOne({ _id: new ObjectId(decoded.id) });
          if (!user) return res.status(404).json({ error: 'User not found' });
          delete user.password; // don't send password
          return res.status(200).json(user);
        } catch (e) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }

      // Admin endpoints
      const isAdmin = (req) => {
         // Using the existing admin JWT mechanism from /api/auth
         const authHeader = req.headers.authorization;
         if (!authHeader) return false;
         try {
           const tokenStr = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
           const tokenData = JSON.parse(tokenStr);
           return tokenData.role === 'admin' && tokenData.exp > Date.now();
         } catch { return false; }
      };

      if (url === '/api/food/admin/stats' && req.method === 'GET') {
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
        const all = await foodTokensCol.find({}).toArray();
        const stats = {
          total: all.length,
          pending: all.filter(t => t.status === 'Pending').length,
          approved: all.filter(t => t.status === 'Approved').length,
          rejected: all.filter(t => t.status === 'Rejected').length,
          veg: all.filter(t => t.food_type === 'Vegetarian').length,
          nonVeg: all.filter(t => t.food_type === 'Non-Vegetarian').length,
          today: all.filter(t => new Date(t.created_at).toDateString() === new Date().toDateString()).length,
        };
        // Simple daily aggregation
        const dailyObj = {};
        all.forEach(t => {
          const date = new Date(t.created_at).toLocaleDateString();
          dailyObj[date] = (dailyObj[date] || 0) + 1;
        });
        const daily = Object.keys(dailyObj).map(date => ({ date, count: dailyObj[date] }));
        
        return res.status(200).json({ stats, daily });
      }

      if (url === '/api/food/admin/requests' && req.method === 'GET') {
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
        const requests = await foodTokensCol.find({}).sort({ created_at: -1 }).toArray();
        requests.forEach(r => delete r.password);
        return res.status(200).json(requests);
      }

      if (url === '/api/food/admin/reset' && req.method === 'POST') {
        // Unprotected for easy reset as requested by user
        try {
          await foodTokensCol.deleteMany({});
          return res.status(200).json({ success: true, message: 'Tokens reset to 001' });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      }

      const approveMatch = url.match(/^\/api\/food\/admin\/approve\/(.+)$/);
      if (approveMatch && req.method === 'POST') {
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
        const id = approveMatch[1];
        
        // Count existing tokens that have been approved to determine next serial
        const count = await foodTokensCol.countDocuments({ status: 'Approved' });
        const nextSerial = count + 1;
        const token_id = String(nextSerial).padStart(3, '0');
        const qr_code = `${req.headers.origin || 'http://localhost:5173'}/token/verify/${token_id}`;
        
        await foodTokensCol.updateOne({ _id: new ObjectId(id) }, {
          $set: { status: 'Approved', token_id, qr_code, approved_at: new Date().toISOString() }
        });
        return res.status(200).json({ success: true, token_id });
      }

      const rejectMatch = url.match(/^\/api\/food\/admin\/reject\/(.+)$/);
      if (rejectMatch && req.method === 'POST') {
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
        const id = rejectMatch[1];
        const { reason } = await readBody(req);
        
        await foodTokensCol.updateOne({ _id: new ObjectId(id) }, {
          $set: { status: 'Rejected', rejection_reason: reason }
        });
        return res.status(200).json({ success: true });
      }

      // Public verification
      const verifyMatch = url.match(/^\/api\/food\/verify\/(.+)$/);
      if (verifyMatch && req.method === 'GET') {
        const token_id = verifyMatch[1];
        const token = await foodTokensCol.findOne({ token_id });
        if (!token) return res.status(404).json({ error: 'Token not found' });
        return res.status(200).json({
          name: token.name, college_name: token.college_name, food_type: token.food_type,
          status: token.status, redeemed: token.redeemed, token_id: token.token_id, approved_at: token.approved_at
        });
      }

      const redeemMatch = url.match(/^\/api\/food\/redeem\/(.+)$/);
      if (redeemMatch && req.method === 'POST') {
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
        const token_id = redeemMatch[1];
        
        const token = await foodTokensCol.findOne({ token_id });
        if (!token) return res.status(404).json({ error: 'Token not found' });
        if (token.redeemed) return res.status(400).json({ error: 'Token already redeemed' });

        await foodTokensCol.updateOne({ token_id }, {
          $set: { redeemed: true, redeemed_at: new Date().toISOString() }
        });
        return res.status(200).json({ success: true });
      }

      return res.status(404).json({ error: 'Food API Not found' });
    }
    // --- END FOOD TOKEN SYSTEM ENDPOINTS ---

    return res.status(404).json({ error: 'Not found', url });
  } catch (e) {
    console.error('API Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
