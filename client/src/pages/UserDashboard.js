import { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/userDashboard.css';
const UserDashboard = () => {
  const { auth, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [review, setReview] = useState({ content: '', rating: 1 });

  const formRef = useRef();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/books');
        setBooks(res.data);
      } catch (err) {
        console.error('Error loading books:', err);
      }
    };

    fetchBooks();
  }, []);
  const handleDownload = async (url, bookTitle) => {
    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error('Invalid response');

      const blob = await res.blob();

      if (blob.type !== 'application/pdf') {
        alert('❌ Link is not a valid PDF file.');
        return;
      }

      const blobURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Clean filename (remove spaces/special chars)
      const cleanTitle = bookTitle.replace(/[^a-zA-Z0-9]/g, '_');

      link.href = blobURL;
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobURL);
    } catch (err) {
      console.error('Download error:', err);
      alert('❌ Failed to download. Link may be broken or expired.');
    }
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/reviews/add',
        {
          bookId: selectedBook._id,
          content: review.content,
          rating: review.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      alert('✅ Review submitted!');
      setSelectedBook(null);
      setReview({ content: '', rating: 1 });

      const res = await axios.get('/books');
      setBooks(res.data);
    } catch (err) {
      alert(err.response?.data?.error || '❌ Failed to submit review');
    }
  };

  const hasReviewed = (book) =>
    book.reviews?.some((r) => r.userId?._id === auth?.user?._id);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="user-dashboard">
      <div className="header">
        <h2 className="welcome-text">👋 Welcome, <span>{auth?.user?.name || 'User'}</span></h2>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      <h3>📚 All Books</h3>
      <div className="book-list">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>
            <button
              className="download-btn"
              onClick={() => handleDownload(book.fileURL, book.title)}
            >
              📥 Download
            </button>

            <div className="review-section">
              <h5>💬 Reviews</h5>
              {book.reviews?.length > 0 ? (
                book.reviews.map((r) => (
                  <div key={r._id} className="review">
                    <p><strong>{r.userId?.name || 'User'}:</strong> {r.content}</p>
                    <div className="star-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: star <= r.rating ? 'gold' : '#555' }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}

              {!hasReviewed(book) && (
                <button className="review-btn" onClick={() => {
                  setSelectedBook(book);
                  scrollToForm();
                }}>
                  ✍️ Add Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <form onSubmit={handleReviewSubmit} ref={formRef} className="review-form">
          <h4>Add Review for: {selectedBook.title}</h4>
          <textarea
            value={review.content}
            onChange={(e) => setReview({ ...review, content: e.target.value })}
            placeholder="Write your review..."
            required
            rows={4}
          />
          <br />
          <label>Rating: </label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setReview({ ...review, rating: star })}
                style={{
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: star <= review.rating ? 'gold' : '#666',
                }}
              >
                ★
              </span>
            ))}
          </div>
          <br />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setSelectedBook(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default UserDashboard;
