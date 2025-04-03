const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./src/api/restEndPoints');

dotenv.config();

const allowedOrigins = ['http://localhost:5173', 'https://softcraft-portfolio.vercel.app', 'https://www.softcraftbol.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, 
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});