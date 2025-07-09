import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  fileURL: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

export default mongoose.model('Book', bookSchema);
