import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleGeminiApi } from './server/geminiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(async (req, res, next) => {
  if (req.url?.startsWith('/api/gemini/')) {
    const handled = await handleGeminiApi(req, res);
    if (handled) return;
  }
  next();
});

const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AirNix server running on port ${PORT}`);
});
