import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const addReview = async (req, res) => {
  try {
    const { bookId, content, rating } = req.body;

    if (!bookId || !content || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if this user already reviewed this book
    const alreadyReviewed = await Review.findOne({
      bookId,
      userId: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You already reviewed this book' });
    }

    // Create review
    const newReview = await Review.create({
      bookId,
      userId: req.user.id,
      content,
      rating,
    });

    // Add review ID to book
    await Book.findByIdAndUpdate(bookId, {
      $push: { reviews: newReview._id },
    });
    const io = req.app.get('io');
    io.emit('new-review', { bookId });
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const reviews = await Review.find({ bookId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// PATCH /api/reviews/:id
// reviewController.js
export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { content, rating } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { content, rating },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Emit socket event to notify users
    const io = req.app.get('io'); // 👈 access io
    io.emit('review-updated', { bookId: review.bookId }); // 🔔 notify clients

    res.json({ message: '✅ Review updated', review });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: '❌ Failed to update review' });
  }
};

export const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Broadcast via socket.io
    const io = req.app.get('io');
    io.emit('review-deleted', { bookId: deleted.bookId });

    res.json({ message: '✅ Review deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
