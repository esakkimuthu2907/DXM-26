import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  if (!uri) return res.status(500).json({ error: 'No MONGODB_URI' });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dxm26');
    const result = await db.collection('food_tokens').deleteMany({});
    return res.status(200).json({ success: true, deleted: result.deletedCount, message: 'Tokens reset to 001' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
}
