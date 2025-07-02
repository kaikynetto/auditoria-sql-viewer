import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT * FROM "lucas"."MERGED_AUDITORIA"`);
    await client.end();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
