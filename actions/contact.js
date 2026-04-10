'use server';
  
import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { revalidatePath } from 'next/cache';

export async function submitInquiry(prevState, formData) {
  try {
    // 1. Connect to the real database
    await connectToDatabase();

    // 2. Extract and validate data
    const newInquiryData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      message: formData.get('message'),
    };

    if (!newInquiryData.name || !newInquiryData.email || !newInquiryData.message) {
      return { success: false, message: 'Please fill out all required fields.' };
    }

    // 3. Create a new document in MongoDB
    await Inquiry.create(newInquiryData);

    // 4. Tell the Admin panel to refresh its data
    revalidatePath('/admin/inquiries');

    return { success: true, message: 'Your inquiry has been received. Our team will contact you shortly.' };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}