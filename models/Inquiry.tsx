import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  projectVision: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { 
  // This is the "magic line" that connects to your specific collection
  collection: 'contacts' 
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);