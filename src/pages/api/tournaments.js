import { Client } from 'pg';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'; // <- Caminho relativo ao arquivo

// Inicializa o middleware de CORS
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // ⚠️ em produção troque por seu domínio
  })
);

export default async function handler(req, res) {
  await cors(req, res); // Executa o middleware de CORS

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
