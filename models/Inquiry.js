import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String }, // Changed from projectType to match the form
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Important for Next.js: Check if model already exists
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry;