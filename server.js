
const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database setup
/*
const db = new sqlite3.Database('./signup.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});
*/

const db = new Database('./signup.db');
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Routes
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
/*
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(sql, [name, email, password], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Sign up successful!', id: this.lastID });
    }); */

    try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, password);

    res.json({ message: 'Sign up successful!', id: result.lastInsertRowid });

} catch (err) {

    if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Database error' });
}

});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const stmt = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (!user) {
            return res.status(401).json({ error: 'No account found with this email. Please sign up first.' });
        }

        // Simple password check (in production, use bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Sign in successful!', id: user.id, name: user.name });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/signup-count', (req, res) => {
    /*db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ count: row.count });
    });
    */
   const row = db.prepare('SELECT COUNT(*) as count FROM users').get();
   res.json({ count: row.count });
});

app.get('/users', (req, res) => {
    /*
    db.all('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ users: rows });
    });
    */
   const rows = db.prepare(
   'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
   ).all();

   res.json({ users: rows });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// sign-up page (GET) - form is posted to POST /signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
