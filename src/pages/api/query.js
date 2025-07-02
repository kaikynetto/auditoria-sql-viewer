import { Client } from 'pg';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'; // ajuste se necessário

// Inicializa o middleware de CORS
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: '*', // ⚠️ Em produção, defina seu domínio seguro
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query inválida ou ausente no corpo da requisição' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    const result = await client.query(query);
    await client.end();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao executar query:', error);
    res.status(500).json({ error: 'Erro ao executar a query', details: error.message });
  }
}
