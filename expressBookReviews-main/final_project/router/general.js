const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const allBooks = Object.values(books);
  const formattedBooks = JSON.stringify(allBooks, null, 2);
  res.setHeader('Content-Type', 'application/json');
  return res.send(formattedBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);
  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => book.title.includes(title));
  return res.json(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const reviews = book.reviews || {};
  return res.json(reviews);
});

// Task 10: Get the list of books available using promises with Axios
public_users.get('/external-books', function (req, res) {
  // GET request to an external API (localhost in this case) to fetch books
  axios.get('http://localhost:5000/').then((response) => {
      const externalBooks = response.data;
      res.setHeader('Content-Type', 'application/json');
      return res.send(externalBooks);
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Internal server error' });
    });
});

// Task 11: Get book details based on ISBN using promises with Axios
public_users.get('/external-books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
   // GET request to an external API (localhost in this case) to fetch book details by ISBN
  axios.get(`http://localhost:5000/isbn/${isbn}`).then((response) => {
      const externalBooks = response.data;
      res.setHeader('Content-Type', 'application/json');
      return res.json(externalBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'Book not found' });
    });
});

// Task 12: Get book details based on Author using promises with Axios
public_users.get('/external-books/author/:author', function (req, res) {
  const author = req.params.author;
  // GET request to an external API (localhost in this case) to fetch books by the author
  axios.get(`http://localhost:5000/author/${author}`).then((response) => {
      const externalBooksByAuthor = response.data;
      res.setHeader('Content-Type', 'application/json');
      return res.json(externalBooksByAuthor);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'Book by author not found' });
    });
});

// Task 13: Get book details based on Title using promises with Axios
public_users.get('/external-books/title/:title', function (req, res) {
  const title = req.params.title;
  // GET request to an external API (localhost in this case) to fetch books by title
  axios.get(`http://localhost:5000/title/${title}`).then((response) => {
      const externalBooksByTitle = response.data;
      res.setHeader('Content-Type', 'application/json');
      return res.json(externalBooksByTitle);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'Book by title not found' });
    });
});

module.exports.general = public_users;
