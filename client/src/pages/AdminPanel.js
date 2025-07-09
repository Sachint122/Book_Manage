import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminPanel = () => {
  const { auth } = useAuth(); // ✅ Get JWT and user info
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    fileURL: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/books/upload', form, {
        headers: {
          Authorization: `Bearer ${auth?.token}`, // ✅ Required
        },
      });

      alert('✅ Book uploaded!');
      setForm({ title: '', author: '', description: '', fileURL: '' });
      fetchBooks();
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.error || '❌ Upload failed');
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // ✅ Required
          },
        });
        fetchBooks();
      } catch (err) {
        console.error('Delete error:', err);
        alert(err.response?.data?.error || '❌ Delete failed');
      }
    }
  };

  const handleReviewEdit = (bookId) => {
    alert(`🔧 Redirect to review editor for book ID: ${bookId}`);
    // You can use navigate(`/admin/review/${bookId}`) if using react-router
  };

  return (
    <div className="admin-container">
      <h2>📚 Admin Panel</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="📖 Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="✍️ Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <textarea
          placeholder="📝 Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="🔗 PDF File URL"
          value={form.fileURL}
          onChange={(e) => setForm({ ...form, fileURL: e.target.value })}
          required
        />
        <button type="submit">🚀 Upload Book</button>
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div key={book._id} className="book-item">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>

            <div className="admin-actions">
              <a
                href={book.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn download"
              >
                📥 Download
              </a>
              <button className="action-btn delete" onClick={() => handleDelete(book._id)}>
                🗑️ Delete
              </button>
              <button className="action-btn review" onClick={() => handleReviewEdit(book._id)}>
                📝 Edit Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
