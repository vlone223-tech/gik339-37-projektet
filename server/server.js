const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const server = express();
const port = 3000;

// Middleware for JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Enable CORS
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// SQLite connection
const db = new sqlite3.Database("./book.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Fetch all books
server.get("/library", (req, res) => {
  db.all("SELECT * FROM library", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Fetch a specific book by ID
server.get("/library/:id", (req, res) => {
  db.get("SELECT * FROM library WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Book not found" });
    res.json(row);
  });
});

// Add a new book
server.post("/library", (req, res) => {
  const { bookTitle, bookGenre, publishedYear, rating } = req.body;
  if (!bookTitle || !bookGenre || !publishedYear || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }
  db.run(
    "INSERT INTO library (bookTitle, bookGenre, publishedYear, rating) VALUES (?, ?, ?, ?)",
    [bookTitle, bookGenre, publishedYear, rating],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Book added successfully", id: this.lastID });
    }
  );
});

// Update a book by ID
server.put("/library/:id", (req, res) => {
  const { bookTitle, bookGenre, publishedYear, rating } = req.body;
  const { id } = req.params;

  if (!bookTitle || !bookGenre || !publishedYear || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.run(
    "UPDATE library SET bookTitle = ?, bookGenre = ?, publishedYear = ?, rating = ? WHERE id = ?",
    [bookTitle, bookGenre, publishedYear, rating, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: "Book not found" });
      res.json({ message: "Book updated successfully" });
    }
  );
});

// Delete a book by ID
server.delete("/library/:id", (req, res) => {
  db.run("DELETE FROM library WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
