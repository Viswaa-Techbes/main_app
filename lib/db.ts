import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

function getMongoUri(): string {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  // Try reading from BE/.env
  try {
    const envPaths = [
      path.resolve(process.cwd(), '../BE/.env'),
      path.resolve(process.cwd(), 'BE/.env'),
      'c:\\Work\\technician_app\\BE\\.env',
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/MONGODB_URI\s*=\s*(.*)/);
        if (match && match[1]) {
          return match[1].trim().replace(/['"]/g, '');
        }
      }
    }
  } catch (err) {
    console.warn('[db.ts] Could not read BE/.env:', err);
  }

  return 'mongodb://promoadmin:PromoAdmin@ac-dtpfamu-shard-00-00.vcubuna.mongodb.net:27017,ac-dtpfamu-shard-00-01.vcubuna.mongodb.net:27017,ac-dtpfamu-shard-00-02.vcubuna.mongodb.net:27017/promoDB?ssl=true&replicaSet=atlas-h7ecwq-shard-0&authSource=admin&appName=Cluster0';
}

export async function connectDB() {
  const uri = getMongoUri();
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((m) => {
      console.log('[Main App DB] Connected to MongoDB Atlas successfully');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}
