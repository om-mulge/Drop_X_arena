require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'DropXArena Drop API',
    status: 'running',
  });
});

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'battle-arena-drop-server' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
