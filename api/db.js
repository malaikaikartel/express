const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const app = express();
const port = 3000;

const DB_FILE = 'db.json';

// Fungsi untuk membaca database JSON
const readDB = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

// Fungsi untuk menulis ke database JSON
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Middleware
app.use(bodyParser.json());

// CREATE
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const newItem = {
    id: nanoid(),
    name,
    description,
    createdAt: new Date().toISOString()
  };

  const db = readDB();
  db.items.push(newItem);
  writeDB(db);

  res.status(201).json(newItem);
});

// READ ALL (findMany)
app.get('/items', (req, res) => {
  const db = readDB();
  res.json(db.items);
});

// READ ONE (findOne)
app.get('/items/:id', (req, res) => {
  const db = readDB();
  const item = db.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const db = readDB();
  const item = db.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.name = req.body.name || item.name;
  item.description = req.body.description || item.description;
  writeDB(db);

  res.json(item);
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const db = readDB();
  const index = db.items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Item not found' });

  db.items.splice(index, 1);
  writeDB(db);

  res.json({ message: 'Item deleted' });
});

// SEARCH by name or description
app.get('/search', (req, res) => {
  const { query } = req.query;
  const db = readDB();
  const results = db.items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// SEARCH by Date & Time
app.get('/search/date', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  const db = readDB();
  const results = db.items.filter(item => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= startDate && createdAt <= endDate;
  });

  res.json(results);
});

// Server
app.listen(port, () => {
  println(`Server running at http://localhost:${port}`);
});
