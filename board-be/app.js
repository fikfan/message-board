const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

//setup db connection
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.all("PRAGMA table_info(messages)", [], (err, rows) => {
  if (err) {
    console.error("Error checking table structure:", err);
  } else {
    console.log("Current table structure:", rows);
  }
});

//create table
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  user TEXT,
  created_at DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, '+8 hours'))
)`);

//retrieve messages
app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Sending messages:', rows);
    res.json(rows);
  });
});

//post messages
app.post('/messages', (req, res) => {
  console.log('Received POST request to /messages');
  console.log('Request body:', req.body);
  
  const { content, user } = req.body;

  db.run('INSERT INTO messages (content, user) VALUES (?, ?)', [content, user || null], function(err) {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`Message added with rowid ${this.lastID}`);
    res.json({ id: this.lastID });
  });
});

//start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});