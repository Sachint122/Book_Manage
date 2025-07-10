import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/adminDashboard.css';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editData, setEditData] = useState({ content: '', rating: 1 });
  const navigate = useNavigate();
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      alert("✅ Book deleted!");
      fetchBooks(); // Refresh
    } catch (err) {
      alert("❌ Failed to delete book");
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      alert('✅ Review deleted');
      fetchBooks(); // reload book list
    } catch (err) {
      console.error('Delete error:', err);
      alert('❌ Failed to delete review');
    }
  };

  useEffect(() => {
    fetchBooks();
    socket.on('new-review', () => fetchBooks());
    socket.on('bookDeleted', fetchBooks);
    socket.on('bookAdded', fetchBooks);

    return () => {
      socket.off('bookDeleted');
      socket.off('new-review');
      socket.off('bookAdded'); // ✅ Correct
    }

  }, []);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditData({ content: review.content, rating: review.rating });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`/reviews/${editingReview._id}`, editData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      alert('✅ Review updated!');
      setEditingReview(null);
      fetchBooks();
    } catch (err) {
      alert('❌ Failed to update review');
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h2>🛠️ Admin Dashboard</h2>
        <span className="welcome-text">
          Welcome, <span className="username">{auth?.user?.name}</span>
        </span>
        <div className="header-buttons">
          <button className="add-book-btn" onClick={() => navigate('/admin/add-book')}>➕ Add Book</button>
          <button className="logout-btn" onClick={logout}>🚪 Logout</button>
        </div>
      </div>

      <h3>📚 All Books & Reviews</h3>
      <div className="book-list">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>
            <button
              className="delete-btn"
              onClick={() => handleDeleteBook(book._id)}
            >
              🗑️ Delete Book
            </button>
            <div className="review-section">
              <h5>💬 Reviews</h5>
              {book.reviews?.length > 0 ? (
                book.reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    {editingReview?._id === review._id ? (
                      <>
                        <textarea
                          value={editData.content}
                          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                          rows={3}
                        />
                        <select
                          value={editData.rating}
                          onChange={(e) => setEditData({ ...editData, rating: parseInt(e.target.value) })}
                        >
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r} ★</option>
                          ))}
                        </select>
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={() => setEditingReview(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <p><strong>{review.userId?.name || 'User'}:</strong> {review.content}</p>
                        <div className="star-display">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: star <= review.rating ? 'gold' : '#aaa' }}>
                              ★
                            </span>
                          ))}
                        </div>
                        <button onClick={() => handleEditClick(review)}>✏️ Edit</button>
                        {/* Delete Button */}
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
