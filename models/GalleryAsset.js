// models/GalleryAsset.js
import mongoose from 'mongoose';

const GalleryAssetSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true }, // The secure URL of the uploaded image
  alt: { type: String, default: 'Taruna Interiors Gallery Space' },
  span: { type: String, enum: ['half', 'full'], default: 'half' },
}, { timestamps: true });

export default mongoose.models.GalleryAsset || mongoose.model('GalleryAsset', GalleryAssetSchema);