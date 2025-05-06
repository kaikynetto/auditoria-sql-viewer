// pages/api/tournament.js
import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10),
    ssl: { rejectUnauthorized: false },
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
