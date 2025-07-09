import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/addBook.css';

const AddBook = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    fileURL: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/books/upload', book, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      alert('✅ Book added successfully!');
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.error || '❌ Failed to add book');
    }
  };

  return (
    <div className="add-book-container">
      <h2>➕ Add New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <input
          type="text"
          placeholder="Title"
          required
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          required
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          rows={4}
          value={book.description}
          onChange={(e) => setBook({ ...book, description: e.target.value })}
        />
        <input
          type="url"
          placeholder="PDF URL"
          required
          value={book.fileURL}
          onChange={(e) => setBook({ ...book, fileURL: e.target.value })}
        />
        <button type="submit">📚 Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
