import Book from '../models/Book.js';

export const uploadBook = async (req, res) => {
  try {
    const { title, author, description, fileURL } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      fileURL,
      uploadedBy: req.user.id, // assumes auth middleware sets req.user
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Failed to upload book' });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'name' }
    });
    res.status(200).json(books);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
