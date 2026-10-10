'use server';
import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry'; // This now points to the default export above
import nodemailer from 'nodemailer';

export async function submitInquiry(prevState, formData) {
  try {
    await connectToDatabase();

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      message: formData.get('message'),
    };

    // 1. Save to MongoDB
    await Inquiry.create(data);

    // 2. Email logic... (Your existing code is good here)
    // ...
    
    return { success: true, message: 'Inquiry sent successfully!' };
  } catch (error) {
    console.error('Submission Error:', error);
    return { success: false, message: 'Failed to send inquiry.' };
  }
}