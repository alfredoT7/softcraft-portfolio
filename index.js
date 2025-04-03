const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./src/api/restEndPoints');

dotenv.config();

app.use(cors({
  origin: ["http://localhost:5173","https://www.softcraftbol.com"],
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