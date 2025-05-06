import { Client } from 'pg';
require('dotenv').config();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user, password } = req.body;

  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized: false,  // Isso desabilita a verificação do certificado
      },
  });
  

  try {
    await client.connect();
    console.log(user, password)
    const result = await client.query(
      `SELECT * FROM "lucas"."MERGED_AUDITORIA_LOGINS" WHERE username = $1 AND password = $2`,
      [user, password]
    );
    await client.end();


    if (result.rows.length > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (err) {
    console.error('Erro ao conectar ou consultar:', err);
    return res.status(500).json({ error: err });
  }
}
