// controllers/bookController.js

import Book from '../models/Book.js';

// ✅ Upload a new book
export const uploadBook = async (req, res) => {
  try {
    const { title, author, description, fileURL } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      fileURL,
      uploadedBy: req.user?.id || null, // make safe if user is optional
    });

    // ✅ Emit 'bookAdded' event to all connected clients
    if (req.io) {
      req.io.emit('bookAdded', book);
    }

    res.status(201).json(book);
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: 'Failed to upload book' });
  }
};

// ✅ Get all books with reviews populated
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'name' }
    });

    res.status(200).json(books);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// ✅ Delete a book by ID
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ✅ Emit 'bookDeleted' event to all clients
    if (req.io) {
      req.io.emit('bookDeleted', bookId);
    }

    res.status(200).json({ message: "Book deleted successfully", bookId });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
