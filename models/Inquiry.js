import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  projectVision: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, 
{ 
  collection: 'contacts' // This ensures it uses your specific collection
});

// Important: This check prevents "OverwriteModelError"
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);