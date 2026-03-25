import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  projectType: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// This checks if the model exists before creating a new one (important for Next.js HMR)
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry; // This fixes the "Export default doesn't exist" error