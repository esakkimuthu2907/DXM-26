import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function reset() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dxm26');
    const result = await db.collection('food_tokens').deleteMany({});
    console.log(`Deleted ${result.deletedCount} food tokens. Next token will start from 001.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

reset();
